/**
 * Tournament Status Finite State Machine
 *
 * Single source of truth for valid tournament status transitions.
 * Forward-only transitions per UC-NEW-05 / UC-31.
 */

export const TOURNAMENT_STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['PUBLISHED', 'CANCELLED'],
  PUBLISHED: ['REGISTRATION_OPEN', 'CANCELLED'],
  REGISTRATION_OPEN: ['REGISTRATION_CLOSED', 'CANCELLED'],
  REGISTRATION_CLOSED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Check whether a status transition is valid.
 * Returns the validation result and the list of allowed target statuses.
 */
export function assertValidTransition(
  from: string,
  to: string,
): { valid: boolean; allowed: string[] } {
  const allowed = TOURNAMENT_STATUS_TRANSITIONS[from] ?? [];
  return { valid: allowed.includes(to), allowed };
}
