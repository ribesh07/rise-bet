/*
  Warnings:

  - You are about to drop the column `stake` on the `Bet` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `payload` on the `Bet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `tableId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Bet" DROP COLUMN "stake",
ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "room" TEXT,
DROP COLUMN "payload",
ADD COLUMN     "payload" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "public"."Match" ADD COLUMN     "players" JSONB,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tableId" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
