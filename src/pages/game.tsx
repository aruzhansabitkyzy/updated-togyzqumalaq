import { useCallback, useState, useEffect } from "react";
import { Board } from "../components/Board";
import { Sidebar } from "../components/Sidebar";
import { OtauInfo, GameData, Player } from "../types";
import { useGameSync } from "../hooks/useGameSync";
import { initBoard } from "../utils/initialBoard";
import { lsGet } from "../services/api";

export const Game = () => {
  const { updateGameState, gameDoc } = useGameSync();
  const currentUserId = lsGet("userId", "");

  const handleOtauClick = useCallback(
    (otau: OtauInfo) => {
      if (!gameDoc) return;

      const currentPlayerId = gameDoc.currentTurn;
      if (
        otau.playerId !== currentPlayerId ||
        otau.playerId !== currentUserId ||
        otau.count <= 1
      )
        return;

      const { newBoard, nextTurn, updatedPlayers } = performMove(gameDoc, otau);

      if (newBoard) {
        const updates = {
          board: newBoard,
          currentTurn: nextTurn,
          players: updatedPlayers,
        };

        updateGameState(updates);
        checkGameOver(updatedPlayers);
      }
    },
    [gameDoc, updateGameState]
  );

  const checkGameOver = (players: Player[]) => {
    if (!gameDoc) return;

    const player1Score = players[0]?.score || 0;
    const player2Score = players[1]?.score || 0;

    if (player1Score >= 81 || player2Score >= 81) {
      const winner = player1Score >= 81 ? players[0] : players[1];
      updateGameState({
        winner: winner,
        status: "completed",
      });

      const winnerName = player1Score >= 81 ? players[0].name : players[1].name;
      alert(`${winnerName} wins!`);
    }
  };

  const performMove = (gameData: GameData, selectedOtau: OtauInfo) => {
    // Deep copy to avoid direct mutations
    const newBoard = JSON.parse(JSON.stringify(gameData.board));
    const updatedPlayers = JSON.parse(JSON.stringify(gameData.players));

    const startIndex = newBoard.findIndex(
      (cell: any) =>
        cell.playerId === selectedOtau.playerId && cell.id === selectedOtau.id
    );

    if (startIndex === -1)
      return { newBoard: null, nextTurn: gameData.currentTurn, updatedPlayers };

    let qumalaqs = newBoard[startIndex].count;
    newBoard[startIndex].count = 1;
    qumalaqs--;

    let currentIndex = startIndex;

    while (qumalaqs > 0) {
      currentIndex = (currentIndex + 1) % newBoard.length;

      const player1 = updatedPlayers[0];
      const player2 = updatedPlayers.length > 1 ? updatedPlayers[1] : null;

      const player1TuzdyqIndex =
        player1?.tuzdyqOtauId !== undefined ? player1.tuzdyqOtauId : -1;
      const player2TuzdyqIndex =
        player2?.tuzdyqOtauId !== undefined ? player2.tuzdyqOtauId : -1;

      if (
        (player1TuzdyqIndex !== -1 && currentIndex === player1TuzdyqIndex) ||
        (player2TuzdyqIndex !== -1 && currentIndex === player2TuzdyqIndex)
      ) {
        const tuzdyqOwnerId =
          currentIndex === player1TuzdyqIndex ? player1.id : player2?.id;

        const playerIndex = updatedPlayers.findIndex(
          (p: any) => p.id === tuzdyqOwnerId
        );
        if (playerIndex !== -1) {
          updatedPlayers[playerIndex].score += 1;
        }

        continue;
      }

      newBoard[currentIndex].count++;
      qumalaqs--;
    }

    const endIndex = currentIndex;
    const endOtau = newBoard[endIndex];
    const currentPlayerId = gameData.currentTurn;
    const currentPlayerIndex = updatedPlayers.findIndex(
      (p: any) => p.id === currentPlayerId
    );

    
    if (endOtau.playerId !== currentPlayerId) {
      
      if (endOtau.count % 2 === 0) {
        
        const isTuzdyq = newBoard[endIndex].tuzdyq;
        if (!isTuzdyq) {
          if (currentPlayerIndex !== -1) {
            updatedPlayers[currentPlayerIndex].score += endOtau.count;
            newBoard[endIndex].count = 0;
          }
        }
      }
      else if (endOtau.count === 3) {
        const isTuzdyq = newBoard[endIndex].tuzdyq;
        if (!isTuzdyq && currentPlayerIndex !== -1) {
          if (updatedPlayers[currentPlayerIndex].tuzdyqOtauId === -1) {
            newBoard[endIndex].tuzdyq = true;
            updatedPlayers[currentPlayerIndex].tuzdyqOtauId = endIndex;
            updatedPlayers[currentPlayerIndex].score += 3;
          }
        }
      }
    }

    let nextTurn = currentPlayerId;
    if (updatedPlayers.length > 1) {
      nextTurn =
        updatedPlayers.find((p: any) => p.id !== currentPlayerId)?.id ||
        currentPlayerId;
    }

    return { newBoard, nextTurn, updatedPlayers };
  };

  const getHint = (otau: OtauInfo) => {
    if (!gameDoc || otau.playerId !== gameDoc.currentTurn) return;

    const newBoard = gameDoc.board.map((cell) => ({ ...cell, hover: false }));
    const startIndex = newBoard.findIndex(
      (cell) => cell.playerId === otau.playerId && cell.id === otau.id
    );

    if (startIndex === -1) return;

    let qumalaqs = otau.count;
    let currentIndex = startIndex;
    qumalaqs--;

    while (qumalaqs > 0) {
      currentIndex = (currentIndex + 1) % newBoard.length;

      const player1TuzdyqIndex = gameDoc.players[0]?.tuzdyqOtauId;
      const player2TuzdyqIndex =
        gameDoc.players.length > 1 ? gameDoc.players[1]?.tuzdyqOtauId : -1;

      if (
        (player1TuzdyqIndex !== -1 && currentIndex === player1TuzdyqIndex) ||
        (player2TuzdyqIndex !== -1 && currentIndex === player2TuzdyqIndex)
      ) {
        continue;
      }

      qumalaqs--;
    }

    newBoard[currentIndex].hover = true;
    updateGameState({ board: newBoard });
  };

  const clearHint = () => {
    if (!gameDoc) return;
    const newBoard = gameDoc.board.map((cell) => ({ ...cell, hover: false }));
    updateGameState({ board: newBoard });
  };

  return (
    <div className="p-3 flex justify-between items-center">
      <Board
        handleOtauClick={(otau: OtauInfo) => handleOtauClick(otau)}
        onMouseEnter={getHint}
        onMouseLeave={clearHint}
        currentUserId={currentUserId}
      />
      <Sidebar />
    </div>
  );
};
