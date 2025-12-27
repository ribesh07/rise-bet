/*
  Warnings:

  - You are about to drop the `WingoRound` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WingoBet" DROP CONSTRAINT "WingoBet_roundId_fkey";

-- AlterTable
ALTER TABLE "WingoBet" ADD COLUMN     "duration" "WingoDuration" NOT NULL DEFAULT 'S30',
ADD COLUMN     "result" INTEGER,
ADD COLUMN     "status" "RoundStatus" NOT NULL DEFAULT 'OPEN';

-- DropTable
DROP TABLE "WingoRound";
