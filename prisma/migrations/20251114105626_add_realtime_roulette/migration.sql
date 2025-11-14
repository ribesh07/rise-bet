/*
  Warnings:

  - Added the required column `game` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."BetStatus" ADD VALUE 'REFUNDED';

-- AlterEnum
ALTER TYPE "public"."TransactionType" ADD VALUE 'REFUND';

-- AlterTable
ALTER TABLE "public"."Bet" ADD COLUMN     "game" TEXT NOT NULL,
ADD COLUMN     "payload" TEXT NOT NULL,
ADD COLUMN     "payout" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
