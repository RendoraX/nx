-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordResetToken" DROP NOT NULL,
ALTER COLUMN "verificationToken" DROP NOT NULL;
