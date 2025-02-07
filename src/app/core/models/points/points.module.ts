export interface PointsTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed';
  amount: number;
  description: string;
  requestId?: string;
  createdAt: Date;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  imageUrl?: string;
  available: boolean;
  stock?: number;
} 