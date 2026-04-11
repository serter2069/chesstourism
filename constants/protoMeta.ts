// constants/protoMeta.ts — project description, roles, user scenarios
// Read by /proto before any work

export interface ProtoRole {
  id: string;
  title: string;
  description: string;
}

export interface ScenarioStep {
  action: string;
  screen: string;
  expected: string[];
}

export interface ProtoScenario {
  id: string;
  title: string;
  role: string;
  steps: ScenarioStep[];
  screens: string[];
}

export interface ProtoMeta {
  name: string;
  tagline: string;
  description: string;
  roles: ProtoRole[];
  scenarios: ProtoScenario[];
}

export const projectMeta: ProtoMeta = {
  name: 'ChessTourism',
  tagline: 'International Chess Tourism Association',
  description:
    'A platform for discovering, registering, and managing chess tournaments worldwide. Players find tournaments, commissioners organize them, and admins oversee the entire ecosystem.',
  roles: [
    {
      id: 'GUEST',
      title: 'Guest',
      description:
        'Casual visitor or prospective participant. Browses upcoming tournaments, views results and player ratings without an account.',
    },
    {
      id: 'PARTICIPANT',
      title: 'Participant',
      description:
        'Registered chess player. Discovers tournaments by location/rating/format, registers and pays, tracks ELO progression.',
    },
    {
      id: 'COMMISSIONER',
      title: 'Commissioner',
      description:
        'Accredited judge or tournament organizer. Runs tournaments end-to-end: pairings, results, arbitration, reports.',
    },
    {
      id: 'ADMIN',
      title: 'Admin',
      description:
        'Association staff member. Approves commissioner accreditations, resolves disputes, monitors payments, exports data.',
    },
  ],
  scenarios: [
    {
      id: 'S-001',
      title: 'Guest discovers and browses tournaments',
      role: 'GUEST',
      steps: [
        {
          action: 'Open landing page',
          screen: 'landing',
          expected: ['Hero section visible', 'Upcoming tournaments visible', 'Top rankings visible'],
        },
        {
          action: 'Click "Browse Tournaments"',
          screen: 'tournaments',
          expected: ['List of tournaments', 'Filters available', 'Status badges visible'],
        },
        {
          action: 'Click on a tournament card',
          screen: 'tournament-detail',
          expected: ['Tournament info visible', 'Tabs for details/participants/results', 'Registration CTA'],
        },
      ],
      screens: ['landing', 'tournaments', 'tournament-detail'],
    },
    {
      id: 'S-002',
      title: 'Participant registers and pays for tournament',
      role: 'PARTICIPANT',
      steps: [
        {
          action: 'Open login page and enter email',
          screen: 'login',
          expected: ['Email input visible', 'Get Code button visible'],
        },
        {
          action: 'Enter OTP code',
          screen: 'otp',
          expected: ['OTP input fields', 'Verify button'],
        },
        {
          action: 'View dashboard after login',
          screen: 'dashboard',
          expected: ['Profile block', 'Rating block', 'Tournaments block'],
        },
        {
          action: 'Open tournament and register',
          screen: 'tournament-detail',
          expected: ['Register button', 'Fee information'],
        },
        {
          action: 'Complete payment',
          screen: 'payment',
          expected: ['Payment form', 'Stripe checkout'],
        },
      ],
      screens: ['login', 'otp', 'dashboard', 'tournament-detail', 'payment'],
    },
    {
      id: 'S-003',
      title: 'Commissioner creates and manages tournament',
      role: 'COMMISSIONER',
      steps: [
        {
          action: 'Open commissioner cabinet',
          screen: 'commissioner-cabinet',
          expected: ['Commissioner stats', 'Create tournament CTA', 'Recent tournaments'],
        },
        {
          action: 'Create new tournament',
          screen: 'create-tournament',
          expected: ['Tournament form', 'All required fields'],
        },
        {
          action: 'Manage tournament hub',
          screen: 'tournament-hub',
          expected: ['Status management', 'Registrations list', 'Results entry'],
        },
      ],
      screens: ['commissioner-cabinet', 'create-tournament', 'tournament-hub'],
    },
    {
      id: 'S-004',
      title: 'Admin moderates platform',
      role: 'ADMIN',
      steps: [
        {
          action: 'Open admin dashboard',
          screen: 'admin',
          expected: ['Counters for users/tournaments/organizations', 'Navigation to sections'],
        },
        {
          action: 'Review moderation queue',
          screen: 'admin-moderation',
          expected: ['Pending approvals', 'Approve/reject actions'],
        },
        {
          action: 'View finances',
          screen: 'admin-finances',
          expected: ['Revenue summary', 'Transaction list'],
        },
      ],
      screens: ['admin', 'admin-moderation', 'admin-finances'],
    },
  ],
};
