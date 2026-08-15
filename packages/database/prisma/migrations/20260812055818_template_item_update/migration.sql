/*
  Warnings:

  - A unique constraint covering the columns `[templateId,productId,variantId]` on the table `TemplateItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TemplateItem_templateId_productId_key";

-- AlterTable
ALTER TABLE "TemplateItem" ADD COLUMN     "variantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TemplateItem_templateId_productId_variantId_key" ON "TemplateItem"("templateId", "productId", "variantId");

-- AddForeignKey
ALTER TABLE "TemplateItem" ADD CONSTRAINT "TemplateItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
