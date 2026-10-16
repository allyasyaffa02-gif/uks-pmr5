export interface ApiResponse<T> {
  message: string;
  data: T;
  status: number;
}

export interface ApiErrorResponse {
  errors?: Record<string, string[]>;
  status: number;
  message: string;
}
