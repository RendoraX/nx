/*
  Warnings:

  - You are about to drop the column `city` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Address` table. All the data in the column will be lost.
  - Added the required column `pincodeId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "pincodeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Pincode" (
    "id" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pincode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pincode_postalCode_key" ON "Pincode"("postalCode");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_pincodeId_fkey" FOREIGN KEY ("pincodeId") REFERENCES "Pincode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
