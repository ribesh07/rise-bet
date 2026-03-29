-- CreateEnum
CREATE TYPE "WingoDuration" AS ENUM ('S30', 'M1', 'M3', 'M5');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('OPEN', 'CLOSED', 'SETTLED');

-- CreateEnum
CREATE TYPE "WingoBetType" AS ENUM ('NUMBER', 'COLOR');

-- CreateTable
CREATE TABLE "WingoRound" (
    "id" SERIAL NOT NULL,
    "duration" "WingoDuration" NOT NULL,
    "status" "RoundStatus" NOT NULL DEFAULT 'OPEN',
    "result" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WingoRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WingoBet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roundId" INTEGER NOT NULL,
    "betType" "WingoBetType" NOT NULL,
    "value" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payout" DOUBLE PRECISION,
    "win" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WingoBet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WingoBet" ADD CONSTRAINT "WingoBet_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "WingoRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
