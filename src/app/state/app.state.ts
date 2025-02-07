import { User } from '../core/models/user/user.module';
import { CollectionRequest } from '../core/models/collection-request.model';
import { PointsTransaction, RewardItem } from '../core/models/points/points.module';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RequestsState {
  requests: CollectionRequest[];
  selectedRequest: CollectionRequest | null;
  loading: boolean;
  error: string | null;
}

export interface PointsState {
  transactions: PointsTransaction[];
  rewards: RewardItem[];
  loading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  requests: RequestsState;
  points: PointsState;
} 