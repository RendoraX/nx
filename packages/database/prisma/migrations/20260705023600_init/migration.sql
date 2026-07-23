/*
  Warnings:

  - You are about to drop the column `sid` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "sid",
ALTER COLUMN "refreshTokenHash" DROP NOT NULL;
