import z from "zod";
import dotenv from "dotenv";
import path from "path";

const rootEnvPath = path.resolve(process.cwd(), "../../../.env.local");

dotenv.config({
  path: rootEnvPath,
});

const envSchema = z.object({
  // DB CONNECTION
  DATABASE_URL: z.string(),

  // AUTH
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),

  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  NODEMAILER_USER: z.string(),
  NODEMAILER_PASS: z.string(),

  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API: z.string(),
  CLOUDINARY_SECRET: z.string(),

  BACKEND_URL: z.string(),
});

export const env = envSchema.parse(process.env);