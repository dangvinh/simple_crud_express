import { ProductCache } from "@/infrastructure/cache/redis-product.cache";
import { Product } from "@/domain/product/entities/product.entity";
import { CACHE_TTL, PRODUCT_CACHE_PREFIX } from "@/config/cache";

// Mock Redis client as an object
const mockRedis = {
  get: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
};

jest.mock("../redis.client", () => ({
  redis: mockRedis,
}));

// Mock logger
jest.mock("@/infrastructure/logging/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

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

    expect(mockRedis.setEx).toHaveBeenCalledWith(
      `${PRODUCT_CACHE_PREFIX}p123`,
      CACHE_TTL,
      JSON.stringify(mockProduct),
    );
  });

  it("should return null if product not in cache", async () => {
    mockRedis.get.mockResolvedValue(null);

    const result = await ProductCache.get("p123");
    expect(result).toBeNull();
    expect(mockRedis.get).toHaveBeenCalledWith(`${PRODUCT_CACHE_PREFIX}p123`);
  });

  it("should parse product from cache", async () => {
    mockRedis.get.mockResolvedValue(JSON.stringify(mockProduct));

    const result = await ProductCache.get("p123");

    expect(result).toBeInstanceOf(Product);
    expect(result?.id).toBe("p123");
  });

  it("should delete product from cache", async () => {
    await ProductCache.del("p123");
    expect(mockRedis.del).toHaveBeenCalledWith(`${PRODUCT_CACHE_PREFIX}p123`);
  });
});
