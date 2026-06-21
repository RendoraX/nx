import z from "zod";
import dotenv from 'dotenv'
import path from "path";

dotenv.config({
    path : path.resolve('../../.env.local')
})

const envSchema = z.object({
    //DB CONNECTION 
    DATABASE_URL  : z.string(),

    //MAIL HELPER
    RESEND_API_KEY: z.string().optional(),

    //AUTH
    JWT_SECRET : z.string(),
    JWT_REFRESH_SECRET : z.string(),


    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
});


export const env = envSchema.parse(process.env)