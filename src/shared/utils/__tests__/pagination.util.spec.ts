import {
  calculatePagination,
  buildPaginatedResult,
  getPaginationMetadata,
} from '../pagination.util';

describe('Pagination Utilities', () => {
  describe('calculatePagination', () => {
    it('should calculate correct offset and limit', () => {
      const result = calculatePagination({ page: 2, limit: 10 });
      expect(result).toEqual({ offset: 10, limit: 10 });
    });

    it('should default page and limit to at least 1', () => {
      const result = calculatePagination({ page: 0, limit: 0 });
      expect(result).toEqual({ offset: 0, limit: 1 });
    });
  });

  describe('buildPaginatedResult', () => {
    const sampleData = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }));

    it('should return a proper paginated result', () => {
      const result = buildPaginatedResult(sampleData, 50, 2, 5);
      expect(result).toEqual({
        data: sampleData,
        page: 2,
        total: 50,
        totalPages: 10,
      });
    });

    it('should handle total = 0 correctly', () => {
      const result = buildPaginatedResult([], 0, 1, 10);
      expect(result).toEqual({
        data: [],
        page: 1,
        total: 0,
        totalPages: 0,
      });
    });
  });
});

describe('getPaginationMetadata', () => {
  it('should return correct metadata for a middle page', () => {
    const result = getPaginationMetadata(100, 2, 10);
    expect(result).toEqual({
      currentPage: 2,
      totalPages: 10,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('should return correct metadata for the first page', () => {
    const result = getPaginationMetadata(50, 1, 10);
    expect(result).toEqual({
      currentPage: 1,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('should return correct metadata for the last page', () => {
    const result = getPaginationMetadata(30, 3, 10);
    expect(result).toEqual({
      currentPage: 3,
      totalPages: 3,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });
});
