export interface GameResponse {
  gameId: string;
  code: string;
  status: 'WAITING_FOR_PLAYERS' | 'IN_PROGRESS' | 'FINISHED';
  players: {
    id: string;
    name: string;
  }[];
}