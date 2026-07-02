import {
  createInventoryEntry,
  createProduct as createProductRecord,
  createProductImages,
  deleteProduct as deleteProductRecord,
  findById as findProductById,
  findBySlug as findProductBySlug,
  findCategoryById,
  findProducts,
  updateProduct as updateProductRecord,
  upsertInventoryEntry,
} from "./products.repository";
import { createProductSchema, productFiltersSchema, updateProductSchema } from "./products.schema";
import type { CreateProductDTO, ProductFiltersDTO, UpdateProductDTO } from "./products.types";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

async function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 1;

  while (await findProductBySlug(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createProduct(payload: CreateProductDTO) {
  const data = createProductSchema.parse(payload);
  const category = await findCategoryById(data.categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const slug = await ensureUniqueSlug(generateSlug(data.name));
  const product = await createProductRecord({
    ...data,
    slug,
  });

  await createInventoryEntry(product.id, data.stock ?? 0);

  if (data.images?.length) {
    await createProductImages(product.id, data.images);
  }

  return findProductById(product.id);
}

export async function getProductBySlug(slug: string) {
  const product = await findProductBySlug(slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function updateProduct(payload: UpdateProductDTO) {
  const data = updateProductSchema.parse(payload);
  const existingProduct = await findProductById(data.id);

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const updatePayload: UpdateProductDTO = {
    ...data,
  };

  if (data.name) {
    const baseSlug = generateSlug(data.name);
    const slug = await ensureUniqueSlug(baseSlug);
    updatePayload.name = data.name;
    (updatePayload as UpdateProductDTO & { slug?: string }).slug = slug;
  }

  const product = await updateProductRecord(updatePayload);

  if (typeof data.stock === "number") {
    await upsertInventoryEntry(product.id, data.stock);
  }

  return findProductById(product.id);
}

export async function deleteProduct(id: string) {
  const existingProduct = await findProductById(id);

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  await deleteProductRecord(id);
  return { id };
}

export async function searchProducts(filters: ProductFiltersDTO = {}) {
  const validatedFilters = productFiltersSchema.parse(filters);
  return findProducts(validatedFilters as ProductFiltersDTO);
}
