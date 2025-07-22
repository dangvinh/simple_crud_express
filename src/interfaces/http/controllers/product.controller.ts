// src/infrastructure/http/express/controllers/product.controller.ts
import { Request, Response } from "express";
import { ProductUseCases } from "@/application/product/use-cases/product.usecase";
import { CreateProductDTO } from "@/application/product/dtos/create-product.dto";
import { UpdateProductDTO } from "@/application/product/dtos/update-product.dto";
import { logger } from "@/infrastructure/logging/logger";
import { PaginationParams, PaginatedResult } from "@/shared/types/pagination";
import { Product } from "@/domain/product/entities/product.entity";

export class ProductController {
  constructor(private readonly productUseCases: ProductUseCases) {}

  /**
   * Retrieve a paginated list of products.
   * @route GET /products
   * @param {number} query.page - Page number for pagination
   * @param {number} query.limit - Number of items per page
   * @returns {PaginatedResult<Product>} 200 - List of products with pagination metadata
   */
  async getAll(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const params: PaginationParams = { page, limit };
      const result: PaginatedResult<Product> =
        await this.productUseCases.getAll(params);

      return res.status(200).json({
        data: result.data,
        pagination: {
          page: result.page,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error("Failed to get products:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Retrieve a single product by its ID.
   * @route GET /products/{id}
   * @param {string} id.path.required - Product ID
   * @returns {Product} 200 - The requested product
   * @returns {Error} 404 - Product not found
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productUseCases.get(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      logger.error("Failed to get product by id:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Create a new product.
   * @route POST /products
   * @param {CreateProductDTO} request.body.required - Product information
   * @returns {Product} 201 - The newly created product
   */
  async create(req: Request, res: Response) {
    try {
      const dto: CreateProductDTO = req.body;
      const created = await this.productUseCases.create(dto);
      return res.status(201).json(created);
    } catch (error) {
      logger.error("Failed to create product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Update an existing product.
   * @route PUT /products/{id}
   * @param {string} id.path.required - Product ID
   * @param {UpdateProductDTO} request.body.required - Updated product information
   * @returns {Product} 200 - The updated product
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateProductDTO = req.body;
      const updated = await this.productUseCases.update(id, dto);
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Failed to update product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Delete a product by its ID.
   * @route DELETE /products/{id}
   * @param {string} id.path.required - Product ID
   * @returns 204 - Product deleted successfully
   */
  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.productUseCases.delete(id);
      return res.status(204).send();
    } catch (error) {
      logger.error("Failed to delete product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
