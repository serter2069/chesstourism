-- CreateTable
CREATE TABLE "TournamentWatchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentWatchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TournamentWatchlist_userId_idx" ON "TournamentWatchlist"("userId");

-- CreateIndex
CREATE INDEX "TournamentWatchlist_tournamentId_idx" ON "TournamentWatchlist"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentWatchlist_userId_tournamentId_key" ON "TournamentWatchlist"("userId", "tournamentId");

-- AddForeignKey
ALTER TABLE "TournamentWatchlist" ADD CONSTRAINT "TournamentWatchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentWatchlist" ADD CONSTRAINT "TournamentWatchlist_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
