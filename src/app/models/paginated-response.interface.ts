export interface PaginatedResponse<T> {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  recordsPerPage: number;
  data: T[];
}
