import { Router } from "express";
import {
  createProductEndpoint,
  deleteProductEndpoint,
  getProductBySlugEndpoint,
  getProductsEndpoint,
  updateProductEndpoint,
} from "./products.controller";

const route = Router();

route.post("/products", createProductEndpoint);
route.get("/products", getProductsEndpoint);
route.get("/products/:slug", getProductBySlugEndpoint);
route.patch("/products/:id", updateProductEndpoint);
route.delete("/products/:id", deleteProductEndpoint);

export default route;
