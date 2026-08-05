import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["cjs"],
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
    ".prisma/client",
    "pg",
  ],
});