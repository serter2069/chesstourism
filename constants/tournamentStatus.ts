export type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface StatusBadgeEntry {
  label: string;
  status: BadgeStatus;
}

/**
 * Canonical tournament status badge definitions.
 * Use this shared constant instead of defining STATUS_BADGE locally in each screen.
 */
export const TOURNAMENT_STATUS_BADGE: Record<string, StatusBadgeEntry> = {
  DRAFT: { label: 'Draft', status: 'default' },
  PUBLISHED: { label: 'Coming Soon', status: 'default' },
  REGISTRATION_OPEN: { label: 'Registration Open', status: 'success' },
  REGISTRATION_CLOSED: { label: 'Registration Closed', status: 'warning' },
  IN_PROGRESS: { label: 'In Progress', status: 'info' },
  COMPLETED: { label: 'Completed', status: 'default' },
  CANCELLED: { label: 'Cancelled', status: 'error' },
};
