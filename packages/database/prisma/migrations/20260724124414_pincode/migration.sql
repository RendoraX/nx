/*
  Warnings:

  - You are about to drop the column `pincodeId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the `Pincode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_pincodeId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "pincodeId";

-- DropTable
DROP TABLE "Pincode";
