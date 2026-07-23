export type UserRole = 'ADMIN' | 'CUSTOMER';
export type UserStatus = 'active' | 'suspended';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean; // Tracking identity status
  createdAt: string;
  cart : any;
  reviews : any;
}

export interface UserSummary {
  total: number;
  admins: number;
  suspended: number;
  unverified: number;
}