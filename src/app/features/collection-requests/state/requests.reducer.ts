import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../../core/models/collection-request.model';

export interface RequestsState {
  requests: CollectionRequest[];
  selectedRequest: CollectionRequest | null;
  loading: boolean;
  error: string | null;
}

export const initialState: RequestsState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  error: null
};

export const requestsReducer = createReducer(
  initialState
); 