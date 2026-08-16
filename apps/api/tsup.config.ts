import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",

  format: ["esm"],
  target: "node20",
  platform: "node",

  clean: true,
  sourcemap: true,
  splitting: false,

  bundle: true,
  dts: false,

  external: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "dotenv",
    "path",
    "fs",
    "url",
    "crypto",
    "stream",
    "util",
    "os",
    "argon2",
    "nodemailer",
    "cloudinary",
    "streamifier",
    "multer",
    "razorpay"
  ],
});