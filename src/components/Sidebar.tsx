import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./Button";
import { resetGame, leaveRoom, lsGet } from "../services/api";
import { useGameSync } from "../hooks/useGameSync";
import Modal from "./modals/GameActions";
import { PlayerTablo } from "./PlayerTablo";

export const Sidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { gameDoc } = useGameSync();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLeaveRoomModalOpen, setIsLeaveRoomModalOpen] = useState(false);

  const currentUserId = lsGet("userId", "");

  const currentPlayerTurn = useMemo(() => {
    return gameDoc?.currentTurn;
  }, [gameDoc?.currentTurn]);

  const opponentUser = useMemo(() => {
    return gameDoc?.players.filter((player) => {
      return player.id !== currentUserId;
    });
  }, [gameDoc?.players]);

  const currentUser = useMemo(() => {
    return gameDoc?.players.filter((player) => {
      return player.id === currentUserId;
    });
  }, [gameDoc?.players]);

  const resetMutation = useMutation({
    mutationFn: resetGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: leaveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      navigate("/");
    },
  });

  const onReset = () => {
    const gameId = lsGet("id", "");
    if (gameId) {
      resetMutation.mutate({ room: gameId });
    }
    setIsResetModalOpen(false);
  };

  const onExit = () => {
    const gameId = lsGet("id", "");
    if (gameId) {
      leaveMutation.mutate({ room: gameId });
    }
    setIsLeaveRoomModalOpen(false);
  };

  return (
    <>
      <div className="h-full flex flex-col justify-between items-center">
        <PlayerTablo
          player={opponentUser?.[0]}
          currentTurn={currentPlayerTurn}
        />

        <div className="flex flex-col gap-3">
          <Button
            text="Reset"
            onClick={() => setIsResetModalOpen(true)}
            disabled={resetMutation.isPending}
          />
          <Button
            text="Exit"
            onClick={() => setIsLeaveRoomModalOpen(true)}
            disabled={leaveMutation.isPending}
          />
        </div>

        <PlayerTablo
          player={currentUser?.[0]}
          currentTurn={currentPlayerTurn}
        />
      </div>
      {isResetModalOpen && (
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onAction={onReset}
          title={"Are you sure you want to reset the game?"}
        />
      )}
      {isLeaveRoomModalOpen && (
        <Modal
          isOpen={isLeaveRoomModalOpen}
          onClose={() => setIsLeaveRoomModalOpen(false)}
          onAction={onExit}
          title={"Are you sure you want to leave the game?"}
        />
      )}
    </>
  );
};

export default Sidebar;
