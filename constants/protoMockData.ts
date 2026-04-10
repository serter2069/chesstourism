export type TournamentStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export type MockTournament = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  status: TournamentStatus;
  fee: number;
  timeControl: string;
  commissar: string;
};

export type MockRatingEntry = {
  rank: number;
  name: string;
  country: string;
  rating: number;
  tournamentCount?: number;
};

export const mockTournaments: MockTournament[] = [
  {
    id: 't1',
    title: 'Tbilisi Open 2025',
    startDate: '2025-06-14',
    endDate: '2025-06-21',
    city: 'Tbilisi',
    country: 'Georgia',
    status: 'open',
    fee: 50,
    timeControl: 'Classical 90+30',
    commissar: 'Giorgi Beridze',
  },
  {
    id: 't2',
    title: 'Oslo Rapid Cup',
    startDate: '2025-07-03',
    endDate: '2025-07-05',
    city: 'Oslo',
    country: 'Norway',
    status: 'open',
    fee: 80,
    timeControl: 'Rapid 15+10',
    commissar: 'Erik Halvorsen',
  },
  {
    id: 't3',
    title: 'Yerevan Blitz Championship',
    startDate: '2025-07-19',
    endDate: '2025-07-20',
    city: 'Yerevan',
    country: 'Armenia',
    status: 'open',
    fee: 30,
    timeControl: 'Blitz 3+2',
    commissar: 'Armen Petrosyan',
  },
  {
    id: 't4',
    title: 'Warsaw Classical',
    startDate: '2025-08-10',
    endDate: '2025-08-17',
    city: 'Warsaw',
    country: 'Poland',
    status: 'open',
    fee: 60,
    timeControl: 'Classical 120+30',
    commissar: 'Piotr Kowalski',
  },
];

export const mockRatings: MockRatingEntry[] = [
  { rank: 1, name: 'Magnus Carlsen', country: 'Norway', rating: 2847, tournamentCount: 62 },
  { rank: 2, name: 'Fabiano Caruana', country: 'USA', rating: 2805, tournamentCount: 58 },
  { rank: 3, name: 'Hikaru Nakamura', country: 'USA', rating: 2794, tournamentCount: 71 },
  { rank: 4, name: 'Arjun Erigaisi', country: 'India', rating: 2778, tournamentCount: 44 },
  { rank: 5, name: 'Nodirbek Abdusattorov', country: 'Uzbekistan', rating: 2762, tournamentCount: 39 },
  { rank: 6, name: 'Wesley So', country: 'USA', rating: 2755, tournamentCount: 53 },
  { rank: 7, name: 'Levon Aronian', country: 'Armenia', rating: 2749, tournamentCount: 48 },
  { rank: 8, name: 'Viswanathan Anand', country: 'India', rating: 2740, tournamentCount: 87 },
  { rank: 9, name: 'Ian Nepomniachtchi', country: 'Russia', rating: 2736, tournamentCount: 41 },
  { rank: 10, name: 'Maxime Vachier-Lagrave', country: 'France', rating: 2728, tournamentCount: 55 },
];
