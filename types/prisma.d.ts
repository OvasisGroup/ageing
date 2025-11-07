declare module '@prisma/client' {
  export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN' | 'MODERATOR';
    createdAt: Date;
    updatedAt: Date;
  }

  export interface UserCreateInput {
    id?: string;
    username: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN' | 'MODERATOR';
  }

  export interface UserWhereInput {
    id?: string;
    username?: string;
    email?: string;
    OR?: UserWhereInput[];
    AND?: UserWhereInput[];
  }

  export interface UserSelect {
    id?: boolean;
    username?: boolean;
    email?: boolean;
    password?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  }

  export interface UserOrderByInput {
    id?: 'asc' | 'desc';
    username?: 'asc' | 'desc';
    email?: 'asc' | 'desc';
    createdAt?: 'asc' | 'desc';
    updatedAt?: 'asc' | 'desc';
  }

  export interface UserDelegate {
    create(args: {
      data: UserCreateInput;
      select?: UserSelect;
    }): Promise<User>;
    
    findFirst(args?: {
      where?: UserWhereInput;
      select?: UserSelect;
    }): Promise<User | null>;
    
    findMany(args?: {
      where?: UserWhereInput;
      select?: UserSelect;
      orderBy?: UserOrderByInput;
    }): Promise<User[]>;
  }

  export class PrismaClient {
    user: UserDelegate;
    
    constructor(options?: {
      log?: ('query' | 'info' | 'warn' | 'error')[];
    });
    
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
  }
}