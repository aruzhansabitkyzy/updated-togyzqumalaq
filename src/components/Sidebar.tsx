import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./Button";
import { resetGame, leaveRoom, lsGet } from "../services/api";
import { useGameSync } from "../hooks/useGameSync";
import Modal from "./modals/GameActions";
import { PlayerTablo } from "./PlayerTablo";
import Loading from "./ui/Loading";

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
      {(resetMutation.isPending || leaveMutation.isPending) && <Loading />}
      <div className="w-1/4 h-[calc(100vh-200px)] flex flex-col justify-between items-center px-5">
        <PlayerTablo
          player={opponentUser?.[0]}
          currentTurn={currentPlayerTurn}
        />

        <div className="flex justify-center gap-3 w-1/4">
          <Button
            text="Reset"
            onClick={() => setIsResetModalOpen(true)}
            disabled={resetMutation.isPending}
            additionalStyle="!w-fit"
          />
          <Button
            text="Exit"
            onClick={() => setIsLeaveRoomModalOpen(true)}
            disabled={leaveMutation.isPending}
            additionalStyle="!w-fit"
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
