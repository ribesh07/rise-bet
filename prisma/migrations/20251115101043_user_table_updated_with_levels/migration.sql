/*
  Warnings:

  - You are about to drop the column `currentLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nextLevel` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "currentLevel",
DROP COLUMN "nextLevel",
ALTER COLUMN "currentLevelName" SET DEFAULT 'Bronze',
ALTER COLUMN "nextLevelName" SET DEFAULT 'Silver';
