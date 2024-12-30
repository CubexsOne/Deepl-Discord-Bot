-- CreateTable
CREATE TABLE "BotSettings" (
    "serverId" VARCHAR(64) NOT NULL,
    "reactionTranslations" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "BotSettings_serverId_key" ON "BotSettings"("serverId");
