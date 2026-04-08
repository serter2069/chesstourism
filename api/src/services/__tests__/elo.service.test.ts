import { calculateEloChanges, TournamentResultEntry } from '../elo.service';

// ---------------------------------------------------------------------------
// Helpers to access internal (exported-for-test) functions via re-import
// We test getKFactor and expectedScore indirectly through calculateEloChanges,
// and directly by re-exporting them below.
// ---------------------------------------------------------------------------

// Re-export internals for unit testing (we test via the public API where possible)
// For K-factor and expectedScore we derive expected values manually and verify
// the final eloChange = Math.round(K * (S - E)).

function makeRatings(entries: Array<{ userId: string; elo: number }>): Map<string, number> {
  return new Map(entries.map((e) => [e.userId, e.elo]));
}

// ---------------------------------------------------------------------------
// K-FACTOR tests (verified via calculateEloChanges with controlled inputs)
// ---------------------------------------------------------------------------

describe('K-factor thresholds (FIDE standard)', () => {
  // Two equal players: avg opponent = player's own elo, so E = 0.5 always.
  // Winner gets score = maxScore, so S = 1.0.
  // eloChange = Math.round(K * (1.0 - 0.5)) = Math.round(K * 0.5)

  function winnerChange(elo: number): number {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo },
      { userId: 'B', elo },
    ]);
    const changes = calculateEloChanges(results, ratings);
    return changes.find((c) => c.userId === 'A')!.eloChange;
  }

  test('K=40 for elo < 2300 (e.g. 1200)', () => {
    // E=0.5, S=1.0 → change = round(40 * 0.5) = 20
    expect(winnerChange(1200)).toBe(20);
  });

  test('K=40 for elo exactly at boundary below 2300 (e.g. 2299)', () => {
    expect(winnerChange(2299)).toBe(20);
  });

  test('K=20 for elo = 2300 (boundary)', () => {
    // round(20 * 0.5) = 10
    expect(winnerChange(2300)).toBe(10);
  });

  test('K=20 for elo in 2300-2399 range (e.g. 2350)', () => {
    expect(winnerChange(2350)).toBe(10);
  });

  test('K=10 for elo >= 2400', () => {
    // round(10 * 0.5) = 5
    expect(winnerChange(2400)).toBe(5);
  });

  test('K=10 for elo = 2500 (high rated)', () => {
    expect(winnerChange(2500)).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Expected score formula tests
// ---------------------------------------------------------------------------

describe('Expected score formula', () => {
  test('Equal rating → eloChange near 0 for loser (S=0, E=0.5 → change = -K*0.5)', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 1500 },
      { userId: 'B', elo: 1500 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    const loser = changes.find((c) => c.userId === 'B')!;
    // K=40, S=0, E=0.5 → change = round(40*(0-0.5)) = round(-20) = -20
    expect(loser.eloChange).toBe(-20);
  });

  test('Equal rating → winner gains symmetrically to loser', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 1500 },
      { userId: 'B', elo: 1500 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    const winner = changes.find((c) => c.userId === 'A')!;
    const loser = changes.find((c) => c.userId === 'B')!;
    expect(winner.eloChange).toBe(-loser.eloChange);
  });

  test('Strong player beats weak: small gain (< K/2)', () => {
    // A=2000, B=1200, A wins: E_A = 1/(1+10^((1200-2000)/400)) ≈ 0.9897
    // K=40 (A < 2300), S=1 → change = round(40*(1-0.9897)) = round(40*0.0103) = round(0.413) = 0
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 2000 },
      { userId: 'B', elo: 1200 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    const winner = changes.find((c) => c.userId === 'A')!;
    // Strong player beating weak should gain very little
    expect(winner.eloChange).toBeGreaterThanOrEqual(0);
    expect(winner.eloChange).toBeLessThan(20);
  });

  test('Weak player beats strong: large gain (> K/2)', () => {
    // B=1200 beats A=2000. B expected score is low, so big reward.
    // avg opponent for B = 2000. E_B = 1/(1+10^((2000-1200)/400)) ≈ 0.0103
    // K=40, S=1 (B has max score) → change = round(40*(1-0.0103)) ≈ round(39.59) = 40
    const results: TournamentResultEntry[] = [
      { userId: 'B', place: 1, score: 10 },
      { userId: 'A', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 2000 },
      { userId: 'B', elo: 1200 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    const winner = changes.find((c) => c.userId === 'B')!;
    expect(winner.eloChange).toBeGreaterThan(20);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('Edge cases', () => {
  test('Single participant: no ELO change', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
    ];
    const ratings = makeRatings([{ userId: 'A', elo: 1500 }]);
    const changes = calculateEloChanges(results, ratings);
    expect(changes).toHaveLength(1);
    expect(changes[0].eloChange).toBe(0);
    expect(changes[0].eloAfter).toBe(changes[0].eloBefore);
  });

  test('New player with no rating (missing from map) defaults to 1200', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'NEW', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([{ userId: 'B', elo: 1200 }]);
    // NEW not in map → defaults to 1200
    const changes = calculateEloChanges(results, ratings);
    const newPlayer = changes.find((c) => c.userId === 'NEW')!;
    expect(newPlayer.eloBefore).toBe(1200);
  });

  test('Draw (odd participants, middle place): outcome = draw', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 5 },
      { userId: 'C', place: 3, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 1500 },
      { userId: 'B', elo: 1500 },
      { userId: 'C', elo: 1500 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    expect(changes.find((c) => c.userId === 'B')!.outcome).toBe('draw');
    expect(changes.find((c) => c.userId === 'A')!.outcome).toBe('win');
    expect(changes.find((c) => c.userId === 'C')!.outcome).toBe('loss');
  });

  test('All scores zero: fallback to placement-based scoring', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 0 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 1500 },
      { userId: 'B', elo: 1500 },
    ]);
    // Should not throw, fallback applies
    const changes = calculateEloChanges(results, ratings);
    expect(changes).toHaveLength(2);
    // With fallback: A gets S=1.0 (place 1 of 2), B gets S=0.0
    // Equal ratings → E=0.5, K=40
    // A: round(40*(1.0-0.5))=20, B: round(40*(0-0.5))=-20
    expect(changes.find((c) => c.userId === 'A')!.eloChange).toBe(20);
    expect(changes.find((c) => c.userId === 'B')!.eloChange).toBe(-20);
  });

  test('Rating exactly 2300: uses K=20', () => {
    // K=20, equal ratings → E=0.5, winner: round(20*0.5)=10
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 2300 },
      { userId: 'B', elo: 2300 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    expect(changes.find((c) => c.userId === 'A')!.eloChange).toBe(10);
  });

  test('Rating exactly 2400: uses K=10', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 2400 },
      { userId: 'B', elo: 2400 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    expect(changes.find((c) => c.userId === 'A')!.eloChange).toBe(5);
  });

  test('eloAfter = eloBefore + eloChange for every participant', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 5 },
      { userId: 'C', place: 3, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 1600 },
      { userId: 'B', elo: 1500 },
      { userId: 'C', elo: 1400 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    for (const c of changes) {
      expect(c.eloAfter).toBe(c.eloBefore + c.eloChange);
    }
  });

  test('Two participants: outcome win/loss correctly assigned', () => {
    const results: TournamentResultEntry[] = [
      { userId: 'A', place: 1, score: 10 },
      { userId: 'B', place: 2, score: 0 },
    ];
    const ratings = makeRatings([
      { userId: 'A', elo: 1500 },
      { userId: 'B', elo: 1500 },
    ]);
    const changes = calculateEloChanges(results, ratings);
    expect(changes.find((c) => c.userId === 'A')!.outcome).toBe('win');
    expect(changes.find((c) => c.userId === 'B')!.outcome).toBe('loss');
  });
});
