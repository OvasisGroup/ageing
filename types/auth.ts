export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  subRole?: 'FAMILY_MEMBER' | 'CAREGIVER' | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  businessName?: string;
  parentUserId?: string;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserResponse = Omit<User, 'password'>;

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface RegisterResponse {
  message: string;
  user: UserResponse;
}