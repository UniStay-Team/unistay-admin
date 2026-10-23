export interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorBody {
  error: {
    status: number;
    details: string | Record<string, string[]> | string[];
  };
}
