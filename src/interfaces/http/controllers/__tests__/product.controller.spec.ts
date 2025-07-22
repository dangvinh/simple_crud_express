import { Request, Response } from "express";
import { ProductController } from "../product.controller";
import { ProductUseCases } from "@/application/product/use-cases/product.usecase";

jest.mock("@/application/use-cases/product.usecase");

describe("ProductController", () => {
  let controller: ProductController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    controller = new ProductController();
    req = {};
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson, send: jest.fn() })) as any;
    res = {
      status: mockStatus,
      json: mockJson,
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all products with total count", async () => {
    const mockProducts = [{ id: "1", name: "Product A" }];
    (ProductUseCases.prototype.getAll as jest.Mock).mockResolvedValue({
      products: mockProducts,
      total: 1,
    });

    req.query = { limit: "10", page: "1" };
    await controller.getAll(req as Request, res as Response);

    expect(ProductUseCases.prototype.getAll).toHaveBeenCalledWith(10, 1);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ products: mockProducts, total: 1 });
  });

  it("should return a product by ID", async () => {
    const mockProduct = { id: "1", name: "Product A" };
    (ProductUseCases.prototype.get as jest.Mock).mockResolvedValue(mockProduct);

    req.params = { id: "1" };
    await controller.getById(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockProduct);
  });

  it("should return 404 if product not found", async () => {
    (ProductUseCases.prototype.get as jest.Mock).mockResolvedValue(null);

    req.params = { id: "1" };
    await controller.getById(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: "Product not found" });
  });

  it("should create a product", async () => {
    const dto = { name: "New Product", price: 100 };
    const createdProduct = { id: "1", ...dto };
    (ProductUseCases.prototype.create as jest.Mock).mockResolvedValue(
      createdProduct,
    );

    req.body = dto;
    await controller.create(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith(createdProduct);
  });

  it("should update a product", async () => {
    const dto = { name: "Updated Product" };
    const updatedProduct = { id: "1", ...dto };
    (ProductUseCases.prototype.update as jest.Mock).mockResolvedValue(
      updatedProduct,
    );

    req.params = { id: "1" };
    req.body = dto;
    await controller.update(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(updatedProduct);
  });

  it("should delete a product", async () => {
    (ProductUseCases.prototype.delete as jest.Mock).mockResolvedValue(
      undefined,
    );

    req.params = { id: "1" };
    await controller.remove(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
