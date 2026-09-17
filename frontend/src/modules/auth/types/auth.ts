export interface AuthUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export interface AuthMessageResponse {
  success: boolean;
  message: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface ResetPasswordInput {
  username: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  username: string;
  oldPassword: string;
  newPassword: string;
}
