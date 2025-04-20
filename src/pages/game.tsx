import { useCallback, useMemo, useState } from "react";
import { Board } from "../components/Board";
import { Sidebar } from "../components/Sidebar";
import { OtauInfo, Player } from "../types";
import { useGameSync } from "../hooks/useGameSync";
import { lsGet, resetGame } from "../services/api";
import { Popup } from "../components/modals/Popup";
import Modal from "../components/modals/GameActions";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { performMove, isGameOver } from "../game/logic/moveLogic";
import { getHint, clearHint } from "../game/logic/boardLogic";

export const Game = () => {
  const { updateGameState, gameDoc } = useGameSync();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupText, setPopupText] = useState<string>("");
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  const currentUserId = lsGet("userId", "");
  const currentTurn = useMemo(() => {
    return gameDoc?.currentTurn;
  }, [gameDoc?.currentTurn]);

  const handlePopupOpen = (text: string) => {
    setIsPopupVisible(true);
    setPopupText(text);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  const handleOtauClick = useCallback(
    (otau: OtauInfo) => {
      if (!gameDoc || !currentTurn) return;

      if (
        otau.playerId !== currentTurn ||
        otau.playerId !== currentUserId ||
        otau.count <= 1
      )
        return;

      const result = performMove(gameDoc, otau, currentTurn, currentUserId);

      if (!result || !result.newBoard) {
        console.warn("Invalid move!");
        return;
      }

      const { newBoard, nextTurn, updatedPlayers } = result;

      const updates = {
        board: newBoard,
        currentTurn: nextTurn,
        players: updatedPlayers,
      };

      updateGameState(updates);

      const lastIndex = updatedPlayers.findIndex(
        (p: any) => p.id === currentTurn
      );
      if (lastIndex !== -1 && updatedPlayers[lastIndex].tuzdyqOtauId !== -1) {
        const currentPlayer = updatedPlayers[lastIndex];
        const previousPlayer = gameDoc.players[lastIndex];

        if (currentPlayer.tuzdyqOtauId !== previousPlayer.tuzdyqOtauId) {
          handlePopupOpen(
            currentUserId === currentPlayer.id
              ? "You won a tuzdyq!"
              : `${currentPlayer.name} won a tuzdyq!`
          );
        }
      }

      isGameOver(
        gameDoc,
        updateGameState,
        setIsWinnerModalOpen,
        updatedPlayers
      );
    },
    [gameDoc, updateGameState, currentTurn, currentUserId]
  );

  const handleBoardHint = useCallback(
    (otau: OtauInfo) => {
      if (!gameDoc || !currentTurn) return;
      getHint(otau, gameDoc, currentTurn, updateGameState);
    },
    [gameDoc, currentTurn, updateGameState]
  );

  const handleClearHint = useCallback(() => {
    if (!gameDoc) return;
    clearHint(gameDoc, updateGameState);
  }, [gameDoc, updateGameState]);

  const resetMutation = useMutation({
    mutationFn: resetGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });

  const onReset = () => {
    const gameId = lsGet("id", "");

    if (gameId) {
      resetMutation.mutate({ room: gameId });
    }
    setIsWinnerModalOpen(false);
  };

  return (
    <div className="p-3 flex justify-between items-center">
      <Board
        handleOtauClick={handleOtauClick}
        onMouseEnter={handleBoardHint}
        onMouseLeave={handleClearHint}
        currentUserId={currentUserId}
      />
      <Sidebar />
      <Popup
        text={popupText}
        isVisible={isPopupVisible}
        removeVisibility={handlePopupClose}
      />
      <Modal
        isOpen={isWinnerModalOpen}
        onClose={() => {
          setIsWinnerModalOpen(false);
          navigate("/");
        }}
        onAction={onReset}
        showConfetti
        title={
          currentUserId === gameDoc?.winner?.id
            ? "Congratulations! You won!"
            : "Oh no, you lose!"
        }
        message="Do you wanna play again?"
        primaryButtonText="Yes"
        secondaryButtonText="No"
      />
    </div>
  );
};
