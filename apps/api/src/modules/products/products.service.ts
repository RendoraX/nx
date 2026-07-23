import {
  createInventoryEntry,
  createProduct as createProductRecord,
  createProductImages,
  deleteProduct as deleteProductRecord,
  findById as findProductById,
  findBySlug as findProductBySlug,
  findCategoryById,
  findProducts,

  upsertInventoryEntry,
  deleteProductImage,
  getRelatedProductByCategory,
} from "./products.repository";
import { createProductSchema, productFiltersSchema, updateProductSchema } from "./products.schema";
import type { CreateProductDTO, ProductFiltersDTO, UpdateProductDTO } from "./products.types";
import { uploadBufferToCloudinary , imageUrlHandler} from '../../../../../packages/storage/src/image.service'
import { string } from "zod";

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
  const fileList = Array.isArray((payload as any).files) ? (payload as any).files : [];
  const incomingImages = Array.isArray((payload as any).images)
    ? (payload as any).images
    : typeof (payload as any).images === "string"
      ? [(payload as any).images]
      : [];

  const normalizedPayload = {
    ...payload,
    images: incomingImages,
  };

  const data = createProductSchema.parse(normalizedPayload);
  const category = await findCategoryById(data.categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const slug = await ensureUniqueSlug(generateSlug(data.name));
  const product = await createProductRecord({
    ...data,
    slug,
  });

  await createInventoryEntry(product.id, data.stock ?? 0, (payload as any).variants);

  const uploadedUrl: string[] = [];

  for (const file of fileList) {
    if (file?.buffer) {
      const result = await uploadBufferToCloudinary(file.buffer);
      uploadedUrl.push(result.secure_url);
    }
  }

  for (const url of incomingImages) {
    if (typeof url === "string" && url.startsWith("http")) {
      const result = await imageUrlHandler({
        imageURL: url,
        cat: category.name,
        name: payload.name as string,
      });
      uploadedUrl.push(result.secure_url);
    }
  }

  data.images = uploadedUrl;
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


export async function deleteProduct(id: string) {
  const existingProduct = await findProductById(id);

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  await deleteProductRecord(id);
  await deleteProductImage(id as string);
  return { id };
}

export async function searchProducts(filters: ProductFiltersDTO = {}) {
  const validatedFilters = productFiltersSchema.parse(filters);
  return findProducts(validatedFilters as ProductFiltersDTO);
}

export async function getRelatedProduct(id : string){
  if(!id) throw new Error("Invalid category id.");
  return getRelatedProductByCategory(id as string);
}