export type BallType = "regular" | "tuzdyq";

export interface Player {
  id: string;
  name: string;
  score: number;
  tuzdyqOtauId: number
}

export interface OtauInfo {
  playerId: string;
  id: number;
  count: number;
  hover: boolean;
  tuzdyq: boolean;
}

export type GameStatus = "waiting" | "ready" | "in-progress" | "completed";

export interface GameData {
  gameId: string;
  status: GameStatus;
  players: Player[];
  board: OtauInfo[];
  currentTurn: string;
  winner: Player | null;
}
