-- Populate TournamentCommissioner from legacy commissionerId
INSERT INTO "TournamentCommissioner" ("id", "tournamentId", "userId", "role", "assignedAt")
SELECT
  gen_random_uuid()::text,
  t."id",
  t."commissionerId",
  'LEAD',
  NOW()
FROM "Tournament" t
WHERE t."commissionerId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "TournamentCommissioner" tc
    WHERE tc."tournamentId" = t."id" AND tc."userId" = t."commissionerId"
  );
