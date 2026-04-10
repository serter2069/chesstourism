// pageRegistry.ts — single source of truth for proto pages
// Agents MUST read notes[] before working on any page.

export type NavVariant = 'none' | 'public' | 'auth' | 'client' | 'admin';
export type PageGroup = 'Public' | 'Auth' | 'Dashboard' | 'Commissioner' | 'Admin';

export interface PageNote {
  date: string;
  state?: string;
  text: string;
}

export interface PageEntry {
  id: string;
  title: string;
  group: PageGroup;
  route: string;
  stateCount: number;
  nav: NavVariant;
  activeTab?: string;
  notes?: PageNote[];
}

export const pages: PageEntry[] = [
  // ─── Public ────────────────────────────────────────────────────────────────
  {
    id: 'landing',
    title: 'Landing',
    group: 'Public',
    route: '/',
    stateCount: 3,
    nav: 'public',
    notes: [
      {
        date: '2026-04-10',
        text: 'All /proto/states/* must be accessible without auth. app/proto/_layout.tsx is a clean Stack — no auth guard, no Redirect.',
      },
    ],
  },
  {
    id: 'tournaments',
    title: 'Tournament Catalog',
    group: 'Public',
    route: '/tournaments',
    stateCount: 4,
    nav: 'public',
  },
  {
    id: 'tournament-detail',
    title: 'Tournament Detail',
    group: 'Public',
    route: '/tournaments/:id',
    stateCount: 9,
    nav: 'public',
  },
  {
    id: 'commissars',
    title: 'Commissar Catalog',
    group: 'Public',
    route: '/commissars',
    stateCount: 5,
    nav: 'public',
  },
  {
    id: 'commissar-profile',
    title: 'Commissar Public Profile',
    group: 'Public',
    route: '/commissars/:id',
    stateCount: 3,
    nav: 'public',
  },
  {
    id: 'user-profile',
    title: 'Public User Profile',
    group: 'Public',
    route: '/users/:id',
    stateCount: 3,
    nav: 'public',
  },
  {
    id: 'ratings',
    title: 'Rating List',
    group: 'Public',
    route: '/ratings',
    stateCount: 4,
    nav: 'public',
  },
  {
    id: 'elo-history',
    title: 'ELO Rating History',
    group: 'Public',
    route: '/ratings/history',
    stateCount: 5,
    nav: 'public',
  },
  {
    id: 'org-apply',
    title: 'Organization Apply',
    group: 'Public',
    route: '/organizations/apply',
    stateCount: 5,
    nav: 'public',
  },
  {
    id: 'cert-verify',
    title: 'Certificate Verify',
    group: 'Public',
    route: '/verify/:id',
    stateCount: 4,
    nav: 'public',
  },
  {
    id: 'payment-success',
    title: 'Payment Success',
    group: 'Public',
    route: '/payment-success',
    stateCount: 1,
    nav: 'none',
  },

  // ─── Auth ──────────────────────────────────────────────────────────────────
  {
    id: 'login',
    title: 'Email Login',
    group: 'Auth',
    route: '/(auth)/login',
    stateCount: 5,
    nav: 'auth',
  },
  {
    id: 'otp',
    title: 'OTP Verification',
    group: 'Auth',
    route: '/(auth)/otp',
    stateCount: 6,
    nav: 'auth',
  },

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  {
    id: 'dashboard',
    title: 'Dashboard Home',
    group: 'Dashboard',
    route: '/(dashboard)/',
    stateCount: 3,
    nav: 'client',
  },
  {
    id: 'profile',
    title: 'Profile Settings',
    group: 'Dashboard',
    route: '/(dashboard)/profile',
    stateCount: 5,
    nav: 'client',
  },
  {
    id: 'my-registrations',
    title: 'My Registrations',
    group: 'Dashboard',
    route: '/(dashboard)/my-registrations',
    stateCount: 4,
    nav: 'client',
  },
  {
    id: 'watchlist',
    title: 'Watchlist',
    group: 'Dashboard',
    route: '/(dashboard)/watchlist',
    stateCount: 4,
    nav: 'client',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    group: 'Dashboard',
    route: '/notifications',
    stateCount: 4,
    nav: 'client',
  },
  {
    id: 'payment',
    title: 'Payment',
    group: 'Dashboard',
    route: '/(dashboard)/payment/:id',
    stateCount: 4,
    nav: 'client',
  },

  // ─── Commissioner ──────────────────────────────────────────────────────────
  {
    id: 'commissioner-cabinet',
    title: 'Commissioner Cabinet',
    group: 'Commissioner',
    route: '/(dashboard)/commissioner',
    stateCount: 3,
    nav: 'client',
  },
  {
    id: 'commissioner-edit',
    title: 'Commissioner Profile Edit',
    group: 'Commissioner',
    route: '/(dashboard)/commissioner/edit',
    stateCount: 4,
    nav: 'client',
  },
  {
    id: 'my-tournaments',
    title: 'My Tournaments',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/manage',
    stateCount: 4,
    nav: 'client',
  },
  {
    id: 'create-tournament',
    title: 'Create Tournament',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/create',
    stateCount: 4,
    nav: 'client',
  },
  {
    id: 'tournament-hub',
    title: 'Tournament Management Hub',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/:id/hub',
    stateCount: 3,
    nav: 'client',
  },
  {
    id: 'tournament-edit',
    title: 'Tournament Edit',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/:id/edit',
    stateCount: 5,
    nav: 'client',
  },
  {
    id: 'tournament-registrations',
    title: 'Tournament Registrations',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/:id/registrations',
    stateCount: 5,
    nav: 'client',
  },
  {
    id: 'tournament-results',
    title: 'Tournament Results',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/:id/results',
    stateCount: 5,
    nav: 'client',
  },
  {
    id: 'tournament-photos',
    title: 'Tournament Photos',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/:id/photos',
    stateCount: 5,
    nav: 'client',
  },
  {
    id: 'tournament-rounds',
    title: 'Tournament Rounds',
    group: 'Commissioner',
    route: '/(dashboard)/tournaments/:id/rounds',
    stateCount: 4,
    nav: 'client',
  },
  {
    id: 'tournament-schedule',
    title: 'Tournament Schedule',
    group: 'Commissioner',
    route: '/tournaments/:id/schedule',
    stateCount: 4,
    nav: 'public',
  },
  {
    id: 'tournament-announcements',
    title: 'Tournament Announcements',
    group: 'Commissioner',
    route: '/tournaments/:id/announcements',
    stateCount: 4,
    nav: 'public',
  },

  // ─── Admin ─────────────────────────────────────────────────────────────────
  {
    id: 'admin',
    title: 'Admin Dashboard',
    group: 'Admin',
    route: '/(admin)/',
    stateCount: 3,
    nav: 'admin',
  },
  {
    id: 'admin-users',
    title: 'Admin Users',
    group: 'Admin',
    route: '/(admin)/users',
    stateCount: 4,
    nav: 'admin',
  },
  {
    id: 'admin-tournaments',
    title: 'Admin Tournaments',
    group: 'Admin',
    route: '/(admin)/tournaments',
    stateCount: 5,
    nav: 'admin',
  },
  {
    id: 'admin-organizations',
    title: 'Admin Organizations',
    group: 'Admin',
    route: '/(admin)/organizations',
    stateCount: 4,
    nav: 'admin',
  },
  {
    id: 'admin-moderation',
    title: 'Admin Moderation',
    group: 'Admin',
    route: '/(admin)/moderation',
    stateCount: 4,
    nav: 'admin',
  },
  {
    id: 'admin-finances',
    title: 'Admin Finances',
    group: 'Admin',
    route: '/(admin)/finances',
    stateCount: 4,
    nav: 'admin',
  },
  {
    id: 'admin-disputes',
    title: 'Admin Disputes',
    group: 'Admin',
    route: '/(admin)/disputes',
    stateCount: 4,
    nav: 'admin',
  },
  {
    id: 'admin-webhooks',
    title: 'Admin Webhooks',
    group: 'Admin',
    route: '/(admin)/webhooks',
    stateCount: 4,
    nav: 'admin',
  },
  {
    id: 'admin-webhook-detail',
    title: 'Admin Webhook Detail',
    group: 'Admin',
    route: '/(admin)/webhooks/:id',
    stateCount: 3,
    nav: 'admin',
  },
];
