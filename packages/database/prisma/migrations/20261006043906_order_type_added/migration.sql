-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('PRODUCT', 'KIT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "type" "OrderType" NOT NULL DEFAULT 'PRODUCT';
