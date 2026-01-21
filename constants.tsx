
import { Sport, Event, EventStatus } from './types';

export const SPORTS: Sport[] = [
  { id: '1', name: 'Cricket', icon: '🏏' },
  { id: '2', name: 'Football', icon: '⚽' },
  { id: '3', name: 'Tennis', icon: '🎾' },
  { id: '4', name: 'Basketball', icon: '🏀' },
  { id: '5', name: 'Esports', icon: '🎮' },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    sportId: '1',
    homeTeam: 'India',
    awayTeam: 'Australia',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    status: EventStatus.LIVE,
    score: '154/3 (18.2 ov)',
    markets: [
      {
        id: 'm1',
        name: 'Match Winner',
        selections: [
          { id: 's1', name: 'India', odds: 1.65, impliedProbability: 60.6 },
          { id: 's2', name: 'Australia', odds: 2.25, impliedProbability: 44.4 },
        ]
      }
    ]
  },
  {
    id: 'e2',
    sportId: '2',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    status: EventStatus.UPCOMING,
    markets: [
      {
        id: 'm2',
        name: 'Full Time Result',
        selections: [
          { id: 's3', name: 'Real Madrid', odds: 2.10, impliedProbability: 47.6 },
          { id: 's4', name: 'Draw', odds: 3.40, impliedProbability: 29.4 },
          { id: 's5', name: 'Barcelona', odds: 3.20, impliedProbability: 31.2 },
        ]
      }
    ]
  }
];
