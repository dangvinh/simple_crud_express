// src/domain/product/value-objects/product-id.vo.ts

export class ProductId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Product ID is required");
    }
  }

  toString(): string {
    return this.value;
  }
}
