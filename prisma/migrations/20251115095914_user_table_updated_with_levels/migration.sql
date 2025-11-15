-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "currentLevel" TEXT,
ADD COLUMN     "currentLevelName" TEXT,
ADD COLUMN     "nextLevel" TEXT,
ADD COLUMN     "nextLevelName" TEXT,
ADD COLUMN     "progressPercent" INTEGER NOT NULL DEFAULT 0;
