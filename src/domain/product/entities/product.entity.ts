// src/domain/product/entities/product.entity.ts

import { BaseEntity } from "@/shared/base/base.entity";

export class Product extends BaseEntity {
  private _name!: string;
  private _description!: string;
  private _price!: number;
  private _stock!: number;
  private _category!: string;
  private _isActive: boolean;
  private _images!: string[];
  private _tags!: string[];

  constructor(params: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    isActive?: boolean;
    images?: string[];
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this.updateName(params.name);
    this.updateDescription(params.description);
    this.updatePrice(params.price);
    this.updateStock(params.stock);
    this.changeCategory(params.category);
    this._isActive = params.isActive ?? true;
    this._images = [];
    if (params.images) {
      for (const image of params.images) {
        this.addImage(image);
      }
    }
    this._tags = [];
    if (params.tags) {
      for (const tag of params.tags) {
        this.addTag(tag);
      }
    }
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get category(): string {
    return this._category;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get images(): string[] {
    return this._images;
  }

  get tags(): string[] {
    return this._tags;
  }

  // Business methods
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Product name must not be empty.");
    }
    this._name = name.trim();
    this.touch();
  }

  updateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error("Product description must not be empty.");
    }
    if (description.trim().length > 1000) {
      throw new Error("Description is too long.");
    }
    this._description = description.trim();
    this.touch();
  }

  updatePrice(price: number): void {
    if (!Number.isFinite(price)) {
      throw new Error("Price must be a valid number.");
    }
    if (price < 0) throw new Error("Price cannot be negative.");
    this._price = price;
    this.touch();
  }

  updateStock(stock: number): void {
    if (!Number.isInteger(stock)) {
      throw new Error("Stock must be an integer.");
    }
    if (stock < 0) throw new Error("Stock cannot be negative.");
    this._stock = stock;
    this.touch();
  }

  changeCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new Error("Category must not be empty.");
    }
    this._category = category.trim();
    this.touch();
  }

  activate(): void {
    this._isActive = true;
    this.touch();
  }

  deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  addImage(url: string): void {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    if (!urlPattern.test(url)) {
      throw new Error("Invalid image URL.");
    }
    this._images.push(url);
    this.touch();
  }

  removeImage(url: string): void {
    this._images = this._images.filter((image) => image !== url);
    this.touch();
  }

  addTag(tag: string): void {
    if (!tag || tag.trim().length === 0) {
      throw new Error("Tag must not be empty.");
    }
    const normalizedTag = tag.trim();
    if (!this._tags.includes(normalizedTag)) {
      this._tags.push(normalizedTag);
      this.touch();
    }
  }

  removeTag(tag: string): void {
    this._tags = this._tags.filter((t) => t !== tag);
    this.touch();
  }

  /**
   * Business rule: Decrease stock quantity
   */
  public decreaseStock(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer.");
    }
    if (quantity > this._stock) {
      throw new Error("Insufficient stock.");
    }
    this._stock -= quantity;
    this.touch();
  }

  /**
   * Business rule: Increase stock quantity
   */
  public increaseStock(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer.");
    }
    this._stock += quantity;
    this.touch();
  }
}
