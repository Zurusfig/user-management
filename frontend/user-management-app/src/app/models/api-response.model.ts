export interface ApiResponse<T> {
  status: {
    code: string;
    description: string;
  };
  data: T;
}