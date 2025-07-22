// src/infrastructure/http/express/controllers/product.controller.ts
import { Request, Response } from "express";
import { ProductUseCases } from "@/application/product/use-cases/product.usecase";
import { CreateProductDTO } from "@/application/product/dtos/create-product.dto";
import { UpdateProductDTO } from "@/application/product/dtos/update-product.dto";
import { logger } from "@/infrastructure/logging/logger";
import { PaginationParams, PaginatedResult } from "@/shared/types/pagination";
import { Product } from "@/domain/product/entities/product.entity";

const productUseCases = new ProductUseCases();

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const params: PaginationParams = { page, limit };
      const result: PaginatedResult<Product> =
        await productUseCases.getAll(params);

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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productUseCases.get(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      logger.error("Failed to get product by id:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const dto: CreateProductDTO = req.body;
      const created = await productUseCases.create(dto);
      return res.status(201).json(created);
    } catch (error) {
      logger.error("Failed to create product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateProductDTO = req.body;
      const updated = await productUseCases.update(id, dto);
      return res.status(200).json(updated);
    } catch (error) {
      logger.error("Failed to update product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productUseCases.delete(id);
      return res.status(204).send();
    } catch (error) {
      logger.error("Failed to delete product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
