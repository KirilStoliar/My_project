export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserCredentials {
  id?: number;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  name: string;
  surename: string;
  birthDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    email: string;
    role: 'ADMIN' | 'USER';
  } | null;
}
