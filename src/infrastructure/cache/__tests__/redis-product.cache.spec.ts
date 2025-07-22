import { ProductCache } from "../redis-product.cache";
import { Product } from "@/domain/product/entities/product.entity";

// Mock Redis client
jest.mock("../redis.client", () => {
  return {
    redis: {
      get: jest.fn(),
      setEx: jest.fn(),
      del: jest.fn(),
    },
  };
});

import { redis } from "../redis.client";

describe("ProductCache", () => {
  const mockProduct = new Product({
    id: "p123",
    name: "Laptop",
    description: "Gaming",
    price: 1999,
    stock: 10,
    category: "Tech",
    isActive: true,
    tags: ["gamer", "tech"],
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should cache product successfully", async () => {
    await ProductCache.set(mockProduct);

    expect(redis.setEx).toHaveBeenCalledWith(
      "product:p123",
      expect.any(Number), // TTL
      JSON.stringify(mockProduct),
    );
  });

  it("should return null if product not in cache", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    const result = await ProductCache.get("p123");
    expect(result).toBeNull();
    expect(redis.get).toHaveBeenCalledWith("product:p123");
  });

  it("should parse product from cache", async () => {
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(mockProduct));

    const result = await ProductCache.get("p123");

    expect(result).toBeInstanceOf(Product);
    expect(result?.id).toBe("p123");
  });

  it("should delete product from cache", async () => {
    await ProductCache.del("p123");
    expect(redis.del).toHaveBeenCalledWith("product:p123");
  });
});
