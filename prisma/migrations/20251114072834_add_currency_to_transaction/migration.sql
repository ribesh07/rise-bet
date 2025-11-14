/*
  Warnings:

  - Added the required column `currency` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Bet" ADD COLUMN     "currency" "public"."Currency" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "currency" "public"."Currency" NOT NULL;
