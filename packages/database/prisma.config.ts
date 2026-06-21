
import { defineConfig, env } from "prisma/config";
import dotenv from 'dotenv'
import path from "path";

dotenv.config({
    path : path.resolve('../../.env.local')
})

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});