
export enum EventStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  SUSPENDED = 'SUSPENDED'
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
}

export interface Market {
  id: string;
  name: string;
  selections: Selection[];
}

export interface Selection {
  id: string;
  name: string;
  odds: number;
  impliedProbability: number;
}

export interface Event {
  id: string;
  sportId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: EventStatus;
  score?: string;
  markets: Market[];
}

export interface Bet {
  id: string;
  eventId: string;
  selectionId: string;
  selectionName: string;
  eventDescription: string;
  odds: number;
  stake: number;
  payout: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'CASHED_OUT';
  placedAt: string;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  limits: {
    dailyDeposit: number;
    dailyWager: number;
  };
}

export interface RiskMetric {
  marketId: string;
  exposure: number;
  anomalyScore: number;
  liability: number;
}
