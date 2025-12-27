/*
  Warnings:

  - The primary key for the `WingoBet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[uniqueBetId]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "uniqueBetId" TEXT;

-- AlterTable
ALTER TABLE "WingoBet" DROP CONSTRAINT "WingoBet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WingoBet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WingoBet_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Bet_uniqueBetId_key" ON "Bet"("uniqueBetId");
