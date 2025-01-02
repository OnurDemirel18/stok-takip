export interface UserInput {
  email: string;
  password: string;
  name: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  name: string;
} 