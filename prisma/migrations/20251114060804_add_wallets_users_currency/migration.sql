/*
  Warnings:

  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('INR', 'TRX', 'XRP', 'USDT', 'USDC', 'SOL', 'BNB', 'ETH', 'LTC', 'BTC');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "balance",
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "lastLogin" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "balance" DECIMAL(20,12) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_currency_key" ON "public"."Wallet"("userId", "currency");

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
