import z from "zod";
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../../.env.local"),
});

const envSchema = z.object({
    //DB CONNECTION 
    DATABASE_URL  : z.string(),

    //AUTH
    JWT_SECRET : z.string(),
    JWT_REFRESH_SECRET : z.string(),


    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),

    NODEMAILER_USER : z.string(),
    NODEMAILER_PASS : z.string()
});


export const env = envSchema.parse(process.env)