
import { prisma } from "../../../../../packages/database/src/client";
import type { CreateProductDTO, ProductFiltersDTO, UpdateProductDTO, ProductVariantInputDTO } from "./products.types";

function normalizeVariantInput(variant: ProductVariantInputDTO, index: number) {
  const size = (variant.sizeValue + " " + variant.sizeUnit);
  const sku = variant.sku ?? `SKU-${Date.now()}-${index + 1}`;

  return {
    size,
    sku,
    price: variant.price ?? 0,
    comparePrice: variant.comparePrice ?? undefined,
    stock: variant.stock ?? 0,
  };
}

async function ensureInventoryForProduct(productId: string, stock: number, variants?: ProductVariantInputDTO[]) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Product not found");
  }

  const variantInputs = Array.isArray(variants) && variants.length > 0
    ? variants.map((variant, index) => normalizeVariantInput(variant, index))
    : [{ size: "default", sku: product.sku ?? `SKU-${product.id}-default`, price: product.price, stock }];

  await prisma.productVariant.deleteMany({ where: { productId } });

  const createdVariants = [] as Array<{ id: string; inventoryId: string }>;

  for (const variantInput of variantInputs) {

    console.log({
    productId,
    size: variantInput.size,
    sku: variantInput.sku,
  });
    const createdVariant = await prisma.productVariant.create({
      data: {
        productId,
        size: variantInput.size,
        sku: variantInput.sku,
        price: variantInput.price,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        variantId: createdVariant.id,
        stock: variantInput.stock,
        reserved: 0,
      },
    });

    createdVariants.push({ id: createdVariant.id, inventoryId: inventory.id });
  }

  if (createdVariants.length) {
    await prisma.product.update({
      where: { id: productId },
      data: { inventoryId: createdVariants[0].inventoryId },
    });
  }

  return createdVariants;
}

export async function createProduct(payload: CreateProductDTO & { slug: string }) {
  const { stock, images, variants, ...productData } = payload;

  const product = await prisma.product.create({
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
      variants: true,
    },
  });

  if (typeof stock === "number") {
    await ensureInventoryForProduct(product.id, stock, variants);
  }

  return prisma.product.findUniqueOrThrow({
    where: { id: product.id },
    include: {
      category: true,
      inventory: true,
      images: true,
      variants: { include: { inventory: true } },
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
      variants: { include: { inventory: true } },
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
      variants: { include: { inventory: true } },
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
      variants: { include: { inventory: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 20),
    take: filters.limit ?? 20,
  });
}


export async function deleteProduct(id: string) {
  return await prisma.$transaction(async tx => {
    await tx.productVariant.deleteMany({
      where : {
        productId : id as string
      }
    });

    await tx.product.delete({
      where : {
        id
      }
    })
  })
}

export async function findCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function createInventoryEntry(productId: string, stock: number, variants?: ProductVariantInputDTO[]) {
  return ensureInventoryForProduct(productId, stock, variants);
}

export async function upsertInventoryEntry(productId: string, stock: number, variants?: ProductVariantInputDTO[]) {
  const existingVariants = await prisma.productVariant.findMany({ where: { productId } });

  if (Array.isArray(variants) && variants.length > 0) {
    return ensureInventoryForProduct(productId, stock, variants);
  }

  if (existingVariants.length) {
    const targetVariant = existingVariants[0];
    const currentInventory = await prisma.inventory.findFirst({ where: { variantId: targetVariant.id } });

    if (currentInventory) {
      return prisma.inventory.update({
        where: { id: currentInventory.id },
        data: { stock },
      });
    }
  }

  return ensureInventoryForProduct(productId, stock);
}

export async function createProductImages(productId: string, images: Array<string>) {
  return prisma.productImage.createMany({
    data: images.map((image: string, index) => ({
      productId,
      url: image,
      alt: `${productId}-image`,
      position: index,
    })),
  });
}

export async function deleteProductImage(productId : string) {
  return await prisma.productImage.deleteMany({
    where : {
      productId
    }
  })
};

export async function getRelatedProductByCategory(categoryId : string) {
  return await prisma.product.findMany({
    where : {
      categoryId
    },
    include : {
      images : {
        include : {
          product : false
        }
      }
    }
  })
};


export async function findProductByVarId(id : string) {
  return await prisma.productVariant.findUnique({
    where : {
      id
    },
    include : {
      product : true
    }
  })
}