export type ProtoStatus = 'pending' | 'proto' | 'approved';

export type ProtoPage = {
  id: string;
  pagId: string;
  title: string;
  group: string;
  route: string;
  states: string[];
  roles: string[];
  status: ProtoStatus;
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
  },
];
