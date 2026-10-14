export interface AuthUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  /** access token JWT; disimpan di cookie aman oleh tokenStorage */
  accessToken: string;
  /** umur access token dalam detik */
  expiresIn: number;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  accessToken: string;
  expiresIn: number;
}

export interface MeResponse {
  success: boolean;
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
  oldPassword: string;
  newPassword: string;
}
