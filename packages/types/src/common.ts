/** Pagination params for list endpoints */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Generic paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
