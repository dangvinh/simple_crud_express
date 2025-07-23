import type { CreateProductDTO } from '../dtos/create-product.dto';
import type { UpdateProductDTO } from '../dtos/update-product.dto';

import type { Product } from '@/domain/product/entities/product.entity';
import type { PaginationParams, PaginatedResult } from '@/shared/types/pagination';

export interface IProductUseCase {
  create(dto: CreateProductDTO): Promise<Product>;
  update(id: string, dto: UpdateProductDTO): Promise<Product>;
  get(id: string): Promise<Product | null>;
  getAll(params: PaginationParams): Promise<PaginatedResult<Product>>;
  delete(id: string): Promise<void>;
}
