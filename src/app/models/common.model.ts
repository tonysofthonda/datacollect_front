export interface Paginated<T> {
  result: T[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
  elementsByPage: number;
}
