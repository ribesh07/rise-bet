-- CreateTable
CREATE TABLE "public"."BetControl" (
    "id" SERIAL NOT NULL,
    "mode" TEXT,
    "forcedResult" TEXT,
    "winRatio" DOUBLE PRECISION,
    "targetUserId" INTEGER,
    "targetUserName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetControl_pkey" PRIMARY KEY ("id")
);
