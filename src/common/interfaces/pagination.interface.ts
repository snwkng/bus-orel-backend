export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMetadata;
}