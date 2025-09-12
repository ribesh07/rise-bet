-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING';
