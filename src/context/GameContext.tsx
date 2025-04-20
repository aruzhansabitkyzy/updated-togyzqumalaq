import React, { createContext, useState, useCallback, useMemo } from "react";
import { OtauInfo, Player } from "../types";
import { initBoard } from "../utils/initialBoard";

// Expanded GameContextType to include players
interface GameContextType {
  updateBoard: (board: OtauInfo[]) => void;
  setTuzdyq: (otauId: number, playerId: number) => void;
  setScore: (newScore: number, playerId: number) => void;
  updateTurn: () => void;
  startGame: (players: Player[]) => void;
  gameState: GameState;
  endGame: () => void;
  setPlayers: (players: Player[]) => void;
}

// Updated GameState to include players
interface GameState {
  board: OtauInfo[];
  players: Player[];
  player1Tuzdyq: number;
  player2Tuzdyq: number;
  currentTurn: number;
  player1Score: number;
  player2Score: number;
  isGameOver: boolean;
}

// Memoized Context Creation
export const GameContext = createContext<GameContextType>({
  updateBoard: () => {},
  setTuzdyq: () => {},
  setScore: () => {},
  updateTurn: () => {},
  startGame: () => {},
  gameState: {} as GameState,
  endGame: () => {},
  setPlayers: () => {},
});

export function MyGameContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useMemo for initial game state
  const gameStartingValues = useMemo<GameState>(
    () => ({
      board: initBoard,
      players: [],
      player1Tuzdyq: -1,
      player2Tuzdyq: -1,
      currentTurn: 1,
      player1Score: 0,
      player2Score: 0,
      isGameOver: false,
    }),
    []
  );

  // Use useState with explicit type
  const [gameState, setGameState] = useState<GameState>(gameStartingValues);

  // Memoized and optimized game methods
  const startGame = useCallback((players: Player[]) => {
    setGameState((prev) => ({
      ...gameStartingValues,
      players,
    }));
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    setGameState((prev) => ({ ...prev, players }));
  }, []);

  const endGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isGameOver: true }));
  }, []);

  const updateBoard = useCallback((board: OtauInfo[]) => {
    setGameState((prev) => ({ ...prev, board }));
  }, []);

  const setTuzdyq = useCallback((otauId: number, playerId: number) => {
    setGameState((prev) =>
      playerId === 1
        ? { ...prev, player1Tuzdyq: otauId }
        : { ...prev, player2Tuzdyq: otauId }
    );
  }, []);

  const setScore = useCallback((newScore: number, playerId: number) => {
    setGameState((prev) =>
      playerId === 0
        ? { ...prev, player1Score: prev.player1Score + newScore }
        : { ...prev, player2Score: prev.player2Score + newScore }
    );
  }, []);

  const updateTurn = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentTurn: prev.currentTurn === 0 ? 1 : 0,
    }));
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      updateBoard,
      setTuzdyq,
      setScore,
      updateTurn,
      startGame,
      gameState,
      endGame,
      setPlayers,
    }),
    [
      updateBoard,
      setTuzdyq,
      setScore,
      updateTurn,
      startGame,
      gameState,
      endGame,
      setPlayers,
    ]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}
