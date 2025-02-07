import { Component, OnInit } from '@angular/core';
import { PointsService } from '../../../../core/services/points.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PointsTransaction } from '../../../../core/models/points/points.module';

@Component({
  selector: 'app-points-history',
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Points History</h1>
          <p class="mt-2 text-lg text-gray-600">Current Balance: {{ totalPoints }} points</p>
        </div>
        <a routerLink="/points/rewards" 
           class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
          View Rewards
        </a>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li *ngFor="let transaction of transactions" class="px-4 py-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium" 
                   [class.text-green-600]="transaction.type === 'earned'"
                   [class.text-red-600]="transaction.type === 'redeemed'">
                  {{ transaction.type === 'earned' ? '+' : '-' }}{{ transaction.amount }} points
                </p>
                <p class="text-sm text-gray-500">{{ transaction.description }}</p>
              </div>
              <p class="text-sm text-gray-500">
                {{ transaction.createdAt | date:'medium' }}
              </p>
            </div>
          </li>
          <li *ngIf="transactions.length === 0" class="px-4 py-8 text-center text-gray-500">
            No points transactions found.
          </li>
        </ul>
      </div>
    </div>
  `
})
export class PointsHistoryComponent implements OnInit {
  transactions: PointsTransaction[] = [];
  totalPoints: number = 0;

  constructor(
    private pointsService: PointsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loadTransactions(currentUser.id);
      this.loadTotalPoints(currentUser.id);
    }
  }

  private loadTransactions(userId: string): void {
    this.pointsService.getPointsHistory(userId).subscribe(
      transactions => {
        this.transactions = transactions.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
      }
    );
  }

  private loadTotalPoints(userId: string): void {
    this.pointsService.getUserPoints(userId).subscribe(
      points => this.totalPoints = points
    );
  }
} 