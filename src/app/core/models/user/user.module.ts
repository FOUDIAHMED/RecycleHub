export interface User {
  id: string;
  email: string;
  password: string; // For demo purposes only. In production, never store plain passwords
  firstName: string;
  lastName: string;
  role: 'user' | 'collector' | 'admin';
  phoneNumber?: string;
  address?: string;
  profilePhotoUrl?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
} 