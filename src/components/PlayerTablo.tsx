import React from "react";
import { Player } from "../types";
import { lsGet } from "../services/api";

interface PlayerTabloProps {
  player?: Player;
  currentTurn?: string;
}

export const PlayerTablo = React.memo(
  ({ player, currentTurn }: PlayerTabloProps) => {
    if (!player) {
      return (
        <div
          className={`bg-gray-500 rounded-lg p-3 shadow-md flex flex-col items-center gap-3`}
        >
          <p>Waiting for opponent...</p>
        </div>
      );
    }
    return (
      <div
        className={` ${
          player.id === currentTurn ? "bg-yellow-500" : "bg-gray-500"
        } rounded-lg p-3 shadow-md flex flex-col items-center gap-3 w-full`}
      >
        <p>{player.name}</p>
        <p>Score: {player.score}</p>
      </div>
    );
  }
);
