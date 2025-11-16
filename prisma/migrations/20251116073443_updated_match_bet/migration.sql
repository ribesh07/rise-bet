/*
  Warnings:

  - The `status` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Match" DROP COLUMN "status",
ADD COLUMN     "status" "public"."BetStatus" NOT NULL DEFAULT 'PENDING';
