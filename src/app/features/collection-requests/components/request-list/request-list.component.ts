import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CollectionRequest } from '../../../../core/models/collection-request.model';

@Component({
  selector: 'app-request-list',
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Collection Requests</h1>
        <button
          *ngIf="!isCollector"
          routerLink="/requests/new"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          New Request
        </button>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li *ngFor="let request of requests">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-green-600 truncate">
                    {{ request.wasteType | titlecase }} - {{ request.weight | weight:'kg' }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ request.pickupDate | date }} ({{ request.pickupTimeSlot }})
                  </p>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    [class]="getStatusClass(request.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ request.status | titlecase }}
                  </span>
                  <button
                    *ngIf="isCollector && request.status === 'pending'"
                    (click)="acceptRequest(request)"
                    class="px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Accept
                  </button>
                  <button
                    *ngIf="isCollector && request.status === 'accepted' && request.collectorId === currentUserId"
                    (click)="completeRequest(request)"
                    class="px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Complete
                  </button>
                </div>
              </div>
              <div class="mt-2 text-sm text-gray-500">
                {{ request.pickupAddress }}
              </div>
            </div>
          </li>
          <li *ngIf="requests.length === 0" class="px-4 py-8 text-center text-gray-500">
            No collection requests found.
          </li>
        </ul>
      </div>
    </div>
  `
})
export class RequestListComponent implements OnInit {
  requests: CollectionRequest[] = [];
  isCollector: boolean;
  currentUserId: string | undefined;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isCollector = this.authService.isCollector();
    this.currentUserId = this.authService.getCurrentUser()?.id;
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  async loadRequests(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isCollector) {
      this.requests = await this.storageService.getCollectorRequests(currentUser.id);
    } else {
      this.requests = await this.storageService.getUserRequests(currentUser.id);
    }

    // Sort requests by date, most recent first
    this.requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  async acceptRequest(request: CollectionRequest): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const updatedRequest = {
      ...request,
      status: 'accepted' as 'pending' | 'accepted' | 'completed' | 'cancelled',
      collectorId: currentUser.id,
      updatedAt: new Date()
    };

    await this.storageService.updateRequest(updatedRequest);
    this.loadRequests();
  }

  async completeRequest(request: CollectionRequest): Promise<void> {
    const updatedRequest = {
      ...request,
      status: 'completed' as 'pending' | 'accepted' | 'completed' | 'cancelled',
      updatedAt: new Date()
    };

    await this.storageService.updateRequest(updatedRequest);
    this.loadRequests();
  }
} 