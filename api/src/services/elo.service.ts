/**
 * ELO Rating calculation service for multi-player chess tournaments.
 *
 * Algorithm (aligned to FIDE standard):
 * - K factor: 40 (elo < 2300), 20 (elo < 2400), 10 (elo >= 2400)
 * - Expected score: E = 1 / (1 + 10^((R_opponent - R_player) / 400))
 * - New rating: R_new = R_old + K * (S - E)
 * - For tournaments: opponent rating = average of all OTHER participants
 * - S = normalized score (player_score / max_score) mapped to 0..1
 */

export interface TournamentResultEntry {
  userId: string;
  place: number;
  score: number;
}

export interface EloChange {
  userId: string;
  eloBefore: number;
  eloAfter: number;
  eloChange: number;
  outcome: 'win' | 'loss' | 'draw';
}

function getKFactor(elo: number): number {
  if (elo < 2300) return 40;
  if (elo < 2400) return 20;
  return 10;
}

function expectedScore(playerElo: number, opponentElo: number): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
}

/**
 * Determine outcome based on placement in the tournament.
 * Top half = win, bottom half = loss, exact middle (odd count) = draw.
 */
function determineOutcome(
  place: number,
  totalParticipants: number,
): 'win' | 'loss' | 'draw' {
  const midpoint = (totalParticipants + 1) / 2;
  if (place < midpoint) return 'win';
  if (place > midpoint) return 'loss';
  return 'draw';
}

/**
 * Calculate ELO changes for all participants in a tournament.
 *
 * @param results - Array of { userId, place, score } sorted by place
 * @param currentRatings - Map of userId -> current ELO rating
 * @returns Array of EloChange objects for each participant
 */
export function calculateEloChanges(
  results: TournamentResultEntry[],
  currentRatings: Map<string, number>,
): EloChange[] {
  const totalParticipants = results.length;

  if (totalParticipants < 2) {
    // Single participant: no ELO change
    return results.map((r) => {
      const elo = currentRatings.get(r.userId) || 1200;
      return {
        userId: r.userId,
        eloBefore: elo,
        eloAfter: elo,
        eloChange: 0,
        outcome: 'draw' as const,
      };
    });
  }

  // Find max score for normalization
  const maxScore = Math.max(...results.map((r) => r.score));

  // Calculate average opponent rating for each player
  // (average of all OTHER participants' ratings)
  const allElos = results.map((r) => currentRatings.get(r.userId) || 1200);
  const totalElo = allElos.reduce((sum, e) => sum + e, 0);

  const changes: EloChange[] = [];

  for (let i = 0; i < results.length; i++) {
    const entry = results[i];
    const playerElo = currentRatings.get(entry.userId) || 1200;
    const K = getKFactor(playerElo);

    // Average opponent ELO = (sum of all elos - this player's elo) / (n - 1)
    const avgOpponentElo = (totalElo - playerElo) / (totalParticipants - 1);

    // Normalized actual score: S in [0, 1]
    // If maxScore is 0 (all zeros), use placement-based scoring
    let actualScore: number;
    if (maxScore > 0) {
      actualScore = entry.score / maxScore;
    } else {
      // Fallback: use inverse placement (1st gets 1.0, last gets 0.0)
      actualScore = (totalParticipants - entry.place) / (totalParticipants - 1);
    }

    const expected = expectedScore(playerElo, avgOpponentElo);
    const eloChange = Math.round(K * (actualScore - expected));
    const eloAfter = playerElo + eloChange;

    const outcome = determineOutcome(entry.place, totalParticipants);

    changes.push({
      userId: entry.userId,
      eloBefore: playerElo,
      eloAfter,
      eloChange,
      outcome,
    });
  }

  return changes;
}
