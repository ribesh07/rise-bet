-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'BET', 'WIN', 'BONUS');

-- CreateEnum
CREATE TYPE "public"."BetStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "balance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "lastLogin" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "stake" DECIMAL(12,2) NOT NULL,
    "odds" DECIMAL(5,2) NOT NULL,
    "potentialWin" DECIMAL(12,2) NOT NULL,
    "status" "public"."BetStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bet" ADD CONSTRAINT "Bet_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
