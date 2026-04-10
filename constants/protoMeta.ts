// protoMeta.ts — project context for proto-viewer and design tooling
// Describes the ChessTourism platform: roles, scenarios, UC overview

export const protoMeta = {
  project: 'ChessTourism',
  fullName: 'International Chess Tourism Association',
  description:
    'Platform for discovering, registering, and participating in FIDE-rated chess tournaments worldwide. Connects players, certified commissars, and venues across 50+ countries.',

  // ─── Roles ───────────────────────────────────────────────────────────────────
  roles: [
    {
      id: 'guest',
      label: 'Guest',
      description: 'Unauthenticated visitor. Can browse tournaments, commissars, ratings. Cannot register or pay.',
    },
    {
      id: 'player',
      label: 'Player',
      description: 'Registered user. Can register for tournaments, pay fees, track ELO history, view results.',
    },
    {
      id: 'commissar',
      label: 'Commissar',
      description: 'Certified tournament organizer. Can create/manage tournaments, manage registrations, record results, issue certificates.',
    },
    {
      id: 'admin',
      label: 'Admin',
      description: 'Platform administrator. Full access to users, tournaments, organizations, finances, disputes, webhooks.',
    },
  ],

  // ─── Key scenarios (user journeys) ───────────────────────────────────────────
  scenarios: [
    {
      id: 'player-register',
      label: 'Player registers for a tournament',
      steps: [
        'Guest browses Tournament Catalog (landing → /tournaments)',
        'Opens Tournament Detail (/tournaments/:id)',
        'Clicks "Register" → redirected to Login if not authenticated',
        'Logs in via Email OTP ((auth)/login → (auth)/otp)',
        'Returns to tournament, confirms registration form (FIDE ID, agreement)',
        'Pays entry fee (/payment/:id)',
        'Receives confirmation email + notification',
        'Views registration in My Registrations (/my-registrations)',
      ],
    },
    {
      id: 'commissar-create-tournament',
      label: 'Commissar creates and runs a tournament',
      steps: [
        'Logs in → Commissioner Cabinet (/commissioner)',
        'Creates tournament (multi-step form: /tournaments/create)',
        'Publishes → tournament appears in catalog',
        'Manages registrations (/tournaments/:id/registrations)',
        'Runs rounds: generate pairings, record results (/tournaments/:id/rounds, /results)',
        'Uploads photos (/tournaments/:id/photos)',
        'Posts announcements (/tournaments/:id/announcements)',
        'Finalizes results → ELO updated automatically',
        'Issues certificates',
      ],
    },
    {
      id: 'org-apply',
      label: 'Organization applies to host tournaments',
      steps: [
        'Visits Organization Apply page (/organizations/apply)',
        'Submits form (org name, country, FIDE federation code, venue details)',
        'Admin reviews in Admin Organizations (/admin/organizations)',
        'Approved → org can now create tournaments via commissar accounts',
      ],
    },
    {
      id: 'admin-moderation',
      label: 'Admin moderates a dispute',
      steps: [
        'Player submits dispute after result recorded incorrectly',
        'Admin sees dispute in Admin Moderation (/admin/moderation)',
        'Reviews both parties messages',
        'Resolves: corrects result or dismisses',
        'ELO recalculated if needed',
      ],
    },
  ],

  // ─── Navigation flows (navFrom → navTo for key transitions) ──────────────────
  navFlows: [
    { from: 'landing', to: 'tournaments', label: 'Browse Tournaments CTA' },
    { from: 'landing', to: 'org-apply', label: 'Become a Commissar CTA' },
    { from: 'tournaments', to: 'tournament-detail', label: 'Click tournament card' },
    { from: 'tournament-detail', to: 'login', label: 'Register (unauthenticated)' },
    { from: 'tournament-detail', to: 'payment', label: 'Confirm registration' },
    { from: 'payment', to: 'payment-success', label: 'Payment successful' },
    { from: 'login', to: 'otp', label: 'Send OTP code' },
    { from: 'otp', to: 'dashboard', label: 'OTP verified → dashboard' },
    { from: 'dashboard', to: 'my-registrations', label: 'My Registrations tab' },
    { from: 'dashboard', to: 'tournaments', label: 'Browse Tournaments' },
    { from: 'commissioner-cabinet', to: 'create-tournament', label: 'Create Tournament' },
    { from: 'create-tournament', to: 'tournament-hub', label: 'Tournament published' },
    { from: 'tournament-hub', to: 'tournament-registrations', label: 'Manage Registrations' },
    { from: 'tournament-hub', to: 'tournament-rounds', label: 'Manage Rounds' },
    { from: 'tournament-hub', to: 'tournament-results', label: 'Record Results' },
    { from: 'tournament-hub', to: 'tournament-photos', label: 'Upload Photos' },
    { from: 'tournament-hub', to: 'tournament-announcements', label: 'Post Announcements' },
    { from: 'commissars', to: 'commissar-profile', label: 'View Commissar Profile' },
    { from: 'ratings', to: 'elo-history', label: 'View ELO History' },
    { from: 'user-profile', to: 'elo-history', label: 'Player ELO History' },
    { from: 'cert-verify', to: 'tournament-detail', label: 'Verified cert → tournament' },
    { from: 'admin', to: 'admin-users', label: 'Manage Users' },
    { from: 'admin', to: 'admin-tournaments', label: 'Manage Tournaments' },
    { from: 'admin', to: 'admin-moderation', label: 'Moderation' },
    { from: 'admin', to: 'admin-finances', label: 'Finances' },
    { from: 'admin-webhooks', to: 'admin-webhook-detail', label: 'Webhook Detail' },
    { from: 'admin-disputes', to: 'admin-moderation', label: 'Back to Moderation' },
  ],
} as const;

export type ProtoRole = typeof protoMeta.roles[number]['id'];
export type ProtoScenario = typeof protoMeta.scenarios[number]['id'];
