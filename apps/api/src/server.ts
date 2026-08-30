import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from 'cookie-parser'

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env.local"),
});

import { requestLogger} from  '../../../packages/logger/src/index';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { securityHeadersMiddleware } from './middleware/security.middleware';
import healthRoutes from './health/health.routes';

//ROUTES
import authRoutes from './modules/auth/auth.routes'

import cartsRoutes from './modules/carts/carts.routes'
import productsRoutes from './modules/products/products.routes'
import ordersRoutes from './modules/orders/orders.routes'
import paymentsRoutes from './modules/payments/payments.routes'
import deliveryRoutes from './modules/delivery/delivery.routes'
import adminOrderRoutes from './modules/admin-order/admin-order.routes'
import categoryRoutes from './modules/categories/categories.routes'
import inventoryRoutes from './modules/inventory/inventory.routes'
import userAdminRouter from './modules/users/users.routes'
import adminKitRouter from './modules/admin/admin.routes'
import customKitRouter from './modules/customKit/cust.routes'
import wishlistRouter from './modules/wishlist/wishlist.routes'
const app = express();

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(securityHeadersMiddleware);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://nx-nku5t2ox3-swapnilnade07-5809s-projects.vercel.app",
      "https://nx-web-eight.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(healthRoutes);

//AUTH ROUTES
app.use("/api/auth" , authRoutes);
app.use("/api", cartsRoutes);
app.use("/api", productsRoutes);
app.use("/api", ordersRoutes);
app.use("/api", paymentsRoutes);
app.use("/api", deliveryRoutes);
app.use("/api", adminOrderRoutes);
app.use("/api", categoryRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", userAdminRouter);
app.use("/api", adminKitRouter);
app.use("/api", customKitRouter);
app.use("/api" , wishlistRouter)



app.set("trust proxy" , true)


///Health tester
app.get('/api/health' , (_ , res) => {
      return res.status(200).json({
        message : "Server is working !0",
        ip : _.socket.remoteAddress
      })
})


app.listen(4000, () => {
console.log("API running on 4000");
});