import type { Request, Response } from "express";
import { createProduct, deleteProduct, getProductBySlug, getRelatedProduct, searchProducts} from "./products.service";
import { success } from "zod";

export const createProductEndpoint = async (req: Request, res: Response) => {
  try {
    const rawPayload = typeof req.body?.payload === "string" ? JSON.parse(req.body.payload) : req.body?.payload ?? {};
    const files = Array.isArray((req as any).files) ? (req as any).files : [];
    const imageUrls = Array.isArray(req.body?.imageUrls)
      ? req.body.imageUrls
      : req.body?.imageUrls
        ? [req.body.imageUrls]
        : [];

    const payload = {
      ...rawPayload,
      files,
      images: imageUrls,
    };
    console.log(payload.variants)
    const product = await createProduct(payload);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    console.error("Create product failed:", error);
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
    console.log("req")
    const product = await getProductBySlug(req.params.slug as string);

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
      success : true
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Product not found",
      error: error.message,
      success : false 
    });
  }
};


export const deleteProductEndpoint = async (req: Request, res: Response) => {
  try {
    const result = await deleteProduct(req.params.id as string);

    return res.status(200).json({
      message: "Product deleted successfully",
      result,
      success : true
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};


export const getRelatedProductEndpoint = async (req : Request , res : Response) => {
  try {
    const categoryId  =  req.params.catid as string;
    const products = await getRelatedProduct(categoryId);

    return res.status(200).json({
      message : "related product fetched successfully !",
      products,
      success : true
    })
  } catch (error : any) {
    return res.status(500).json({
      message : "Internal server error",
      error : error.message | error,
      success : false
    })
  }
}