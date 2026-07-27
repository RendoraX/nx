/*
  Warnings:

  - A unique constraint covering the columns `[postalCode,officeName]` on the table `Pincode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `district` to the `Pincode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officeName` to the `Pincode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Pincode_postalCode_key";

-- AlterTable
ALTER TABLE "Pincode" ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "officeName" TEXT NOT NULL,
ADD COLUMN     "officeType" TEXT;

-- CreateIndex
CREATE INDEX "Pincode_postalCode_idx" ON "Pincode"("postalCode");

-- CreateIndex
CREATE INDEX "Pincode_city_idx" ON "Pincode"("city");

-- CreateIndex
CREATE INDEX "Pincode_district_idx" ON "Pincode"("district");

-- CreateIndex
CREATE INDEX "Pincode_state_idx" ON "Pincode"("state");

-- CreateIndex
CREATE UNIQUE INDEX "Pincode_postalCode_officeName_key" ON "Pincode"("postalCode", "officeName");
