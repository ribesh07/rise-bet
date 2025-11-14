-- CreateTable
CREATE TABLE "public"."ClientApp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExternalPlayer" (
    "id" SERIAL NOT NULL,
    "clientAppId" INTEGER NOT NULL,
    "externalUserId" TEXT NOT NULL,
    "internalUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExternalWallet" (
    "id" SERIAL NOT NULL,
    "clientAppId" INTEGER NOT NULL,
    "externalUserId" TEXT NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "balance" DECIMAL(20,8) NOT NULL DEFAULT 0,

    CONSTRAINT "ExternalWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientApp_apiKey_key" ON "public"."ClientApp"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalPlayer_clientAppId_externalUserId_key" ON "public"."ExternalPlayer"("clientAppId", "externalUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalWallet_clientAppId_externalUserId_currency_key" ON "public"."ExternalWallet"("clientAppId", "externalUserId", "currency");

-- AddForeignKey
ALTER TABLE "public"."ExternalPlayer" ADD CONSTRAINT "ExternalPlayer_clientAppId_fkey" FOREIGN KEY ("clientAppId") REFERENCES "public"."ClientApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
