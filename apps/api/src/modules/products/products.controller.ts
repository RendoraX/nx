import type { Request, Response } from "express";
import { createProduct, deleteProduct, getProductBySlug, searchProducts, updateProduct } from "./products.service";

export const createProductEndpoint = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const getProductsEndpoint = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const isActive = req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined;

    const products = await searchProducts({
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      categoryId: typeof req.query.categoryId === "string" ? req.query.categoryId : undefined,
      slug: typeof req.query.slug === "string" ? req.query.slug : undefined,
      isActive,
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 20,
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductBySlugEndpoint = async (req: Request, res: Response) => {
  try {
    const product = await getProductBySlug(req.params.slug as string);

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Product not found",
      error: error.message,
    });
  }
};

export const updateProductEndpoint = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deleteProductEndpoint = async (req: Request, res: Response) => {
  try {
    const result = await deleteProduct(req.params.id as string);

    return res.status(200).json({
      message: "Product deleted successfully",
      result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
