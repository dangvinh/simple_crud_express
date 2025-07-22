// src/application/use-cases/product.usecase.ts
import { buildPaginatedResult } from "@/shared/utils/pagination.util";
import { ProductRepository } from "@/domain/product/repositories/product.repository";
import { CreateProductDTO } from "../dtos/create-product.dto";
import { UpdateProductDTO } from "../dtos/update-product.dto";
import { Product } from "@/domain/product/entities/product.entity";
import { PrismaProductRepository } from "@/infrastructure/database/repositories/prisma-product.repository";
import { generateUUID } from "@/shared/utils/uuid.util";
import { logger } from "@/infrastructure/logging/logger";
import { PaginationParams, PaginatedResult } from "@/shared/types/pagination";

import { IProductService } from "../interfaces/product-service.interface";
/**
 * Use cases for Product operations
 */
export class ProductUseCases implements IProductService {
  private readonly repository: ProductRepository;

  constructor(repository?: ProductRepository) {
    this.repository = repository || new PrismaProductRepository();
  }

  async getAll(params: PaginationParams): Promise<PaginatedResult<Product>> {
    const { page, limit } = params;
    logger.info(`Fetching all products with limit=${limit}, page=${page}`);

    const { products, total } = await this.repository.findAllWithCount(params);
    return buildPaginatedResult(products, total, page, limit);
  }

  async get(id: string): Promise<Product | null> {
    logger.info(`Fetching product with id=${id}`);
    return this.repository.findById(id);
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const product = new Product({
      id: generateUUID(), // sinh UUID v4
      ...dto,
      createdAt: dto.createdAt ?? new Date(),
      updatedAt: dto.updatedAt ?? new Date(),
    });
    logger.info(`Creating product with id=${product.id}`);
    await this.repository.save(product);
    return product;
  }

  async update(id: string, dto: UpdateProductDTO): Promise<Product> {
    logger.info(`Updating product with id=${id}`);
    const existing = await this.repository.findById(id);
    if (!existing) {
      logger.warn(`Product with id=${id} not found`);
      throw new Error("Product not found");
    }

    const updated = new Product({
      id,
      name: dto.name ?? existing.name,
      description: dto.description ?? existing.description,
      price: dto.price ?? existing.price,
      stock: dto.stock ?? existing.stock,
      category: dto.category ?? existing.category,
      tags: dto.tags ?? existing.tags,
      images: dto.images ?? existing.images,
      isActive: dto.isActive ?? existing.isActive,
      createdAt: existing.createdAt,
      updatedAt: dto.updatedAt ?? new Date(),
    });

    await this.repository.update(updated);
    logger.info(`Product with id=${id} updated successfully`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    logger.info(`Deleting product with id=${id}`);
    const existing = await this.repository.findById(id);
    if (!existing) {
      logger.warn(`Product with id=${id} not found`);
      throw new Error("Product not found");
    }
    await this.repository.delete(id);
    logger.info(`Product with id=${id} deleted`);
  }
}
