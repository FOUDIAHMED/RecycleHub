import { Injectable } from '@angular/core';
import { PointsTransaction, RewardItem } from '../models/points/points.module';
import { User } from '../models/user/user.module';
import { CollectionRequest } from '../models/collection-request.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'recycleHubDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  public initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: true });
        }

        // Collection requests store
        if (!db.objectStoreNames.contains('requests')) {
          const requestsStore = db.createObjectStore('requests', { keyPath: 'id' });
          requestsStore.createIndex('userId', 'userId', { unique: false });
          requestsStore.createIndex('collectorId', 'collectorId', { unique: false });
        }

        // Points transactions store
        if (!db.objectStoreNames.contains('points')) {
          const pointsStore = db.createObjectStore('points', { keyPath: 'id' });
          pointsStore.createIndex('userId', 'userId', { unique: false });
        }

        // Rewards store
        if (!db.objectStoreNames.contains('rewards')) {
          db.createObjectStore('rewards', { keyPath: 'id' });
        }
      };
    });
  }

  // Users
  async addUser(user: User): Promise<User> {
    await this.performTransaction('users', 'readwrite', store => {
      return store.add(user);
    });
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.performTransaction('users', 'readonly', store => {
      return store.get(id);
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.performTransaction('users', 'readonly', store => {
      const index = store.index('email');
      return index.get(email);
    });
  }

  async updateUser(user: User): Promise<User> {
    await this.performTransaction('users', 'readwrite', store => {
      return store.put(user);
    });
    return user;
  }

  // Collection Requests
  async addRequest(request: CollectionRequest): Promise<CollectionRequest> {
    await this.performTransaction('requests', 'readwrite', store => {
      return store.add(request);
    });
    return request;
  }

  async getRequest(id: string): Promise<CollectionRequest | null> {
    return this.performTransaction('requests', 'readonly', store => {
      return store.get(id);
    });
  }

  async getUserRequests(userId: string): Promise<CollectionRequest[]> {
    return this.performTransaction('requests', 'readonly', store => {
      const index = store.index('userId');
      return this.getAllFromIndex(index, userId);
    });
  }

  async getCollectorRequests(collectorId: string): Promise<CollectionRequest[]> {
    return this.performTransaction('requests', 'readonly', store => {
      const index = store.index('collectorId');
      return this.getAllFromIndex(index, collectorId);
    });
  }

  async updateRequest(request: CollectionRequest): Promise<CollectionRequest> {
    await this.performTransaction('requests', 'readwrite', store => {
      return store.put(request);
    });
    return request;
  }

  // Points Transactions
  async addPointsTransaction(transaction: PointsTransaction): Promise<PointsTransaction> {
    await this.performTransaction('points', 'readwrite', store => {
      return store.add(transaction);
    });
    return transaction;
  }

  async getUserPointsTransactions(userId: string): Promise<PointsTransaction[]> {
    return this.performTransaction('points', 'readonly', store => {
      const index = store.index('userId');
      return this.getAllFromIndex(index, userId);
    });
  }

  // Rewards
  async addReward(reward: RewardItem): Promise<RewardItem> {
    await this.performTransaction('rewards', 'readwrite', store => {
      return store.add(reward);
    });
    return reward;
  }

  async getAllRewards(): Promise<RewardItem[]> {
    return this.performTransaction('rewards', 'readonly', store => {
      return this.getAll(store);
    });
  }

  async updateReward(reward: RewardItem): Promise<RewardItem> {
    await this.performTransaction('rewards', 'readwrite', store => {
      return store.put(reward);
    });
    return reward;
  }

  // Helper methods
  private performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest | Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      try {
        const result = operation(store);
        if (result instanceof Promise) {
          result.then(resolve).catch(reject);
        } else {
          result.onsuccess = () => resolve(result.result);
          result.onerror = () => reject(result.error);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private async getAllFromIndex(index: IDBIndex, key: IDBValidKey): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = index.getAll(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAll(store: IDBObjectStore): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
} 
