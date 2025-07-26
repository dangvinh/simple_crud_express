import type { PaginationParams, PaginatedResult } from '../types/pagination';

// Convert PaginationParams into offset and limit values
export function calculatePagination(params: PaginationParams): {
  offset: number;
  limit: number;
} {
  const safePage = Math.max(params.page, 1);
  const safeLimit = Math.max(params.limit, 1);
  const offset = (safePage - 1) * safeLimit;
  return { offset, limit: safeLimit };
}

// Construct a paginated result from a list of items and total count
export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    page,
    total,
    totalPages,
  };
}

// Get pagination metadata (for UI or API response)
export function getPaginationMetadata(
  total: number,
  page: number,
  limit: number,
): {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
