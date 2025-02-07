import { Injectable } from '@angular/core';
import { Observable, from, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { PointsTransaction, RewardItem } from '../models/points/points.module';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  constructor(private storageService: StorageService) {}

  getUserPoints(userId: string): Observable<number> {
    return from(this.storageService.getUserPointsTransactions(userId)).pipe(
      map(transactions => {
        return transactions.reduce((total, transaction) => {
          return total + (transaction.type === 'earned' ? transaction.amount : -transaction.amount);
        }, 0);
      })
    );
  }

  getPointsHistory(userId: string): Observable<PointsTransaction[]> {
    return from(this.storageService.getUserPointsTransactions(userId));
  }

  getAvailableRewards(): Observable<RewardItem[]> {
    return from(this.storageService.getAllRewards()).pipe(
      map(rewards => rewards.filter(reward => reward.available))
    );
  }

  redeemPoints(userId: string, rewardId: string): Observable<PointsTransaction> {
    return from(this.storageService.getAllRewards()).pipe(
      switchMap(rewards => {
        const reward = rewards.find(r => r.id === rewardId);
        if (!reward) {
          throw new Error('Reward not found');
        }
        if (!reward.available) {
          throw new Error('Reward not available');
        }

        return this.getUserPoints(userId).pipe(
          switchMap(currentPoints => {
            if (currentPoints < reward.pointsCost) {
              throw new Error('Insufficient points');
            }

            const transaction: PointsTransaction = {
              id: crypto.randomUUID(),
              userId,
              type: 'redeemed',
              amount: reward.pointsCost,
              description: `Redeemed for ${reward.name}`,
              createdAt: new Date()
            };

            if (reward.stock !== undefined) {
              reward.stock--;
              reward.available = reward.stock > 0;
              return from(this.storageService.updateReward(reward)).pipe(
                switchMap(() => from(this.storageService.addPointsTransaction(transaction)))
              );
            }

            return from(this.storageService.addPointsTransaction(transaction));
          })
        );
      })
    );
  }

  awardPointsForCollection(requestId: string, points: number): Observable<PointsTransaction> {
    return from(this.storageService.getRequest(requestId)).pipe(
      switchMap(request => {
        if (!request) {
          throw new Error('Request not found');
        }
        if (request.status !== 'completed') {
          throw new Error('Request must be completed to award points');
        }
        if (request.pointsAwarded) {
          throw new Error('Points already awarded for this request');
        }

        const transaction: PointsTransaction = {
          id: crypto.randomUUID(),
          userId: request.userId,
          type: 'earned',
          amount: points,
          description: `Points earned for recycling ${request.weight}kg of ${request.wasteType}`,
          requestId,
          createdAt: new Date()
        };

        request.pointsAwarded = points;
        return from(this.storageService.updateRequest(request)).pipe(
          switchMap(() => from(this.storageService.addPointsTransaction(transaction)))
        );
      })
    );
  }
} 