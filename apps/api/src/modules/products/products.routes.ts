import { Router } from "express";
import {
  createProductEndpoint,
  deleteProductEndpoint,
  getProductBySlugEndpoint,
  getProductsEndpoint,
  getRelatedProductEndpoint
} from "./products.controller";
import upload from "../../utils/multer";

const route = Router();

route.post("/products" , upload.array("images") ,createProductEndpoint);
route.get("/products", getProductsEndpoint);
route.get("/products/:slug", getProductBySlugEndpoint);
route.delete("/products/:id", deleteProductEndpoint);
route.get('/products/related/:catid' , getRelatedProductEndpoint);

export default route;
