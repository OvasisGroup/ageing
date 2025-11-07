export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: Date;
  updatedAt: Date;
}

export type UserResponse = Omit<User, 'password'>;

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
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