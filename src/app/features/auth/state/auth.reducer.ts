import { createReducer, on } from '@ngrx/store';
import { User } from '../../../core/models/user/user.module';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState
); 