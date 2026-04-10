export type ProtoStatus = 'pending' | 'proto' | 'approved';

export type ProtoNote = {
  date: string;
  state?: string;
  text: string;
};

export type ProtoPage = {
  id: string;
  pagId: string;
  title: string;
  group: string;
  route: string;
  states: string[];
  roles: string[];
  status: ProtoStatus;
  notes?: ProtoNote[];
};

export const protoPages: ProtoPage[] = [
  {
    id: 'landing',
    pagId: 'PAG-001',
    title: 'Landing',
    group: 'Public',
    route: '/',
    states: ['default', 'loading', 'empty_tournaments'],
    roles: ['PUBLIC'],
    status: 'proto',
    notes: [
      {
        date: '2026-04-10',
        text: 'All /proto/states/* pages must be accessible without auth. app/proto/_layout.tsx is a clean Stack — no auth guard, no Redirect. Do not add useAuth() here.',
      },
    ],
  },
];
