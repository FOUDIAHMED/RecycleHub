import { Component, OnInit } from '@angular/core';
import { PointsService } from '../../../../core/services/points.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RewardItem } from '../../../../core/models/points/points.module';

@Component({
  selector: 'app-rewards-list',
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Available Rewards</h1>
          <p class="mt-2 text-lg text-gray-600">Your Points: {{ userPoints }}</p>
        </div>
        <a routerLink="/points/history" 
           class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
          View History
        </a>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let reward of rewards" 
             class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">{{ reward.name }}</h3>
              <p class="text-sm font-medium text-green-600">{{ reward.pointsCost }} points</p>
            </div>
            <p class="mt-2 text-sm text-gray-500">{{ reward.description }}</p>
            <div class="mt-4">
              <button
                (click)="redeemReward(reward)"
                [disabled]="userPoints < reward.pointsCost || !reward.available"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {{ reward.available ? 'Redeem' : 'Out of Stock' }}
              </button>
            </div>
          </div>
        </div>
        <div *ngIf="rewards.length === 0" 
             class="col-span-full text-center py-8 text-gray-500">
          No rewards available at the moment.
        </div>
      </div>

      <div *ngIf="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
        {{ error }}
      </div>
    </div>
  `
})
export class RewardsListComponent implements OnInit {
  rewards: RewardItem[] = [];
  userPoints: number = 0;
  error: string | null = null;

  constructor(
    private pointsService: PointsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loadRewards();
      this.loadUserPoints(currentUser.id);
    }
  }

  private loadRewards(): void {
    this.pointsService.getAvailableRewards().subscribe(
      rewards => this.rewards = rewards
    );
  }

  private loadUserPoints(userId: string): void {
    this.pointsService.getUserPoints(userId).subscribe(
      points => this.userPoints = points
    );
  }

  redeemReward(reward: RewardItem): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.error = null;
    this.pointsService.redeemPoints(currentUser.id, reward.id).subscribe({
      next: () => {
        this.loadRewards();
        this.loadUserPoints(currentUser.id);
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }
} 