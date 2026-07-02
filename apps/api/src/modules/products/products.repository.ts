import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../../packages/database/src/client";
import type { CreateProductDTO, ProductFiltersDTO, UpdateProductDTO } from "./products.types";

export async function createProduct(payload: CreateProductDTO & { slug: string }) {
  const { stock, images, ...productData } = payload;

  return prisma.product.create({
    data: {
      ...productData,
      price: productData.price,
      comparePrice: productData.comparePrice ?? undefined,
      isActive: productData.isActive ?? true,
      sku: productData.sku ?? `SKU-${Date.now()}`,
    },
    include: {
      category: true,
      inventory: true,
      images: true,
    },
  });
}

export async function findById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      inventory: true,
      images: true,
    },
  });
}

export async function findBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      inventory: true,
      images: true,
    },
  });
}

export async function findProducts(filters: ProductFiltersDTO = {}) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (typeof filters.isActive === "boolean") {
    where.isActive = filters.isActive;
  }

  if (filters.slug) {
    where.slug = filters.slug;
  }

  return prisma.product.findMany({
    where,
    include: {
      category: true,
      inventory: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 20),
    take: filters.limit ?? 20,
  });
}

export async function updateProduct(payload: UpdateProductDTO) {
  const { id, ...data } = payload;

  const updateData = Object.fromEntries(
    Object.entries({
      name: data.name,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice,
      sku: data.sku,
      categoryId: data.categoryId,
      isActive: data.isActive,
    }).filter(([, value]) => value !== undefined)
  ) as Prisma.ProductUpdateInput;

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      inventory: true,
      images: true,
    },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function findCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function createInventoryEntry(productId: string, stock: number) {
  return prisma.inventory.create({
    data: {
      productId,
      stock,
      reserved: 0,
    },
  });
}

export async function upsertInventoryEntry(productId: string, stock: number) {
  return prisma.inventory.upsert({
    where: { productId },
    update: { stock },
    create: {
      productId,
      stock,
      reserved: 0,
    },
  });
}

export async function createProductImages(productId: string, images: Array<{ url: string; alt?: string; position?: number }>) {
  return prisma.productImage.createMany({
    data: images.map((image, index) => ({
      productId,
      url: image.url,
      alt: image.alt,
      position: image.position ?? index,
    })),
  });
}
