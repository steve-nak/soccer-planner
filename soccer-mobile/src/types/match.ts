export interface Player {
  userId: string;
  userName: string;
  extraSlots: number;
  joinedAt: string;
}

export interface Comment {
  id: number;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Match {
  id: number;
  groupId: number;
  groupTitle: string;
  date: string;
  location: string;
  capacity: number;
  canceled: boolean;
  state: 'upcoming' | 'current' | 'past';
  isActive: boolean;
  playerCount: number;
  capacityStatus: 'full' | 'under' | 'over';
  joinedByCurrentUser?: boolean;
}

export interface MatchDetail extends Match {
  players: Player[];
  comments: Comment[];
}

export interface MatchesResponse {
  items: Match[];
  total: number;
  page: number;
  pageSize: number;
}
