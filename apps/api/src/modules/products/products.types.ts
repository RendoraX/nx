export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  categoryId: string;
  isActive?: boolean;
  stock?: number;
  images?: Array<{
    url: string;
    alt?: string;
    position?: number;
  }>;
}

export interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  comparePrice?: number;
  sku?: string;
  categoryId?: string;
  isActive?: boolean;
  stock?: number;
  images?: Array<{
    url: string;
    alt?: string;
    position?: number;
  }>;
}

export interface ProductFiltersDTO {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  slug?: string;
  page?: number;
  limit?: number;
}
