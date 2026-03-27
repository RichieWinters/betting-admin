export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SportType {
  DOTA2 = 'DOTA2',
  COUNTER_STRIKE = 'COUNTER_STRIKE',
  FORTNITE = 'FORTNITE',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isBanned: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: number;
  date: string;
  sportType: SportType;
  status: Status;
  teamA: string;
  teamB: string;
  winner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bet {
  id: number;
  userId: number;
  matchId: number;
  amount: number;
  team: string;
  result: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
  match: Match;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
