import { createReducer, on } from '@ngrx/store';
import { PointsTransaction, RewardItem } from '../../../core/models/points/points.module';

export interface PointsState {
  transactions: PointsTransaction[];
  rewards: RewardItem[];
  loading: boolean;
  error: string | null;
}

export const initialState: PointsState = {
  transactions: [],
  rewards: [],
  loading: false,
  error: null
};

export const pointsReducer = createReducer(
  initialState
); 