export interface ApiResponse<T> {
  data: T | null;
  message: string | null;
  timestamp: string;
  code: number;
}
