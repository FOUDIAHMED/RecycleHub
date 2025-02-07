import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { RewardItem } from '../models/points/points.module';
import { User } from '../models/user/user.module';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private storageService: StorageService) {}

  async initializeApp(): Promise<void> {
    // Wait for storage service to be ready
    await this.storageService.initDatabase();
    await this.initializeCollectors();
    await this.initializeRewards();
  }

  private async initializeCollectors(): Promise<void> {
    const defaultCollector: User = {
      id: 'collector-1',
      email: 'collector@recyclehub.com',
      password: 'password123', // In production, use hashed passwords
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'collector',
      phoneNumber: '0600000000',
      address: '123 Rue de la Collecte, Casablanca',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const existingCollector = await this.storageService.getUserByEmail(defaultCollector.email);
      if (!existingCollector) {
        await this.storageService.addUser(defaultCollector);
      }
    } catch (error) {
      console.error('Error initializing collector:', error);
    }
  }

  private async initializeRewards(): Promise<void> {
    const defaultRewards: RewardItem[] = [
      {
        id: 'reward-1',
        name: 'Eco-friendly Water Bottle',
        description: 'Reusable stainless steel water bottle',
        pointsCost: 500,
        imageUrl: 'assets/rewards/water-bottle.jpg',
        available: true,
        stock: 50
      },
      {
        id: 'reward-2',
        name: 'Recycled Tote Bag',
        description: 'Shopping bag made from recycled materials',
        pointsCost: 300,
        imageUrl: 'assets/rewards/tote-bag.jpg',
        available: true,
        stock: 100
      },
      {
        id: 'reward-3',
        name: 'Plant a Tree',
        description: 'We will plant a tree in your name',
        pointsCost: 1000,
        imageUrl: 'assets/rewards/tree.jpg',
        available: true
      }
    ];

    try {
      const existingRewards = await this.storageService.getAllRewards();
      if (existingRewards.length === 0) {
        for (const reward of defaultRewards) {
          await this.storageService.addReward(reward);
        }
      }
    } catch (error) {
      console.error('Error initializing rewards:', error);
    }
  }
} 