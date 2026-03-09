export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResult {
  result: boolean;
  token?: string;
  user?: string;
  userEmail?: string;
  errors?: string[];
}
