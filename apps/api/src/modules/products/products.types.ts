

export interface ProductFiltersDTO {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  slug?: string;
  page?: number;
  limit?: number;
}






// products.types.ts

export interface ProductVariantInputDTO {
  id?: string; // Change 'id: string' to 'id?: string'
  size?: string;
  sizeUnit?: string;
  sizeValue?: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  stock?: number;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  comparePrice?: number;
  sku?: string;
  isActive?: boolean;
  stock?: number;
  images?: string[];
  variants?: ProductVariantInputDTO[];
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

export interface IncomingPayloadVariant {
  id?: string;
  size?: string;
  sizeUnit?: string;
  sizeValue?: string;
  sku?: string;
  price?: number | string;
  comparePrice?: number | string;
  stock?: number | string;
}

export interface IncomingProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number | string;
  comparePrice?: number | string;
  sku: string;
  categoryId: string;
  isActive?: boolean;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  images?: Array<{ url: string; alt?: string; position?: number } | string>;
  hasVariants?: boolean;
  variants?: IncomingPayloadVariant[];
  tags?: string[];
  deletedVariantIds?: string[];
  stock?: number | string;
}