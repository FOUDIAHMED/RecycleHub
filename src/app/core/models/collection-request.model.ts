export interface CollectionRequest {
    id: string;
    userId: string;
    collectorId?: string;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    wasteType: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronics';
    weight: number; // in kilograms
    description?: string;
    pickupAddress: string;
    pickupDate: Date;
    pickupTimeSlot: string;
    pointsAwarded?: number;
    createdAt: Date;
    updatedAt: Date;
  } 