import React, { useContext, useEffect, useMemo } from "react";
import Otau from "./ui/Otau";
import Qazandyq from "./ui/Qazandyq";
import { GameData, OtauInfo } from "../types";
import { useGameSync } from "../hooks/useGameSync";
import { initBoard } from "../utils/initialBoard";

export const Board = ({
  handleOtauClick,
  onMouseEnter,
  onMouseLeave,
  currentUserId,
}: {
  handleOtauClick: (otau: OtauInfo) => void;
  onMouseEnter?: (otau: OtauInfo) => void;
  onMouseLeave?: () => void;
  currentUserId: string;
}) => {
  const { gameDoc } = useGameSync();

  if (!gameDoc) return null;

  const currentPlayer = gameDoc.players.find(
    (player) => player.id === currentUserId
  );
  const opponent = gameDoc.players.find(
    (player) => player.id !== currentUserId
  );

  return (
    <div className="w-3/4 h-full bg-stone-400 rounded-md p-5">
      {gameDoc ? (
        <>
          <PlayerOtaus
            isOpponent={true}
            gameDoc={gameDoc}
            onOtauClick={handleOtauClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            playerId={opponent?.id}
            currentUserId={currentUserId}
          />
          <div className="flex flex-col justify-between my-5 gap-5">
            <Qazandyq quantity={currentPlayer ? currentPlayer.score : 0} />
            <Qazandyq quantity={opponent ? opponent.score : 0} />
          </div>
          <PlayerOtaus
            isOpponent={false}
            gameDoc={gameDoc}
            onOtauClick={handleOtauClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            playerId={currentUserId}
            currentUserId={currentUserId}
          />
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

const PlayerOtaus = React.memo(
  ({
    isOpponent,
    gameDoc,
    onOtauClick,
    onMouseEnter,
    onMouseLeave,
    playerId,
    currentUserId,
  }: {
    isOpponent: boolean;
    gameDoc: GameData;
    onOtauClick: (otau: OtauInfo) => void;
    onMouseEnter?: (otau: OtauInfo) => void;
    onMouseLeave?: () => void;
    playerId?: string;
    currentUserId: string;
  }) => {
    const boardWithOnePlayer = initBoard.slice(0, 9);

    const otauBalls = useMemo(() => {
      if (!playerId || gameDoc.players.length < (isOpponent ? 2 : 1)) {
        return boardWithOnePlayer;
      }

      const otaus = gameDoc.board.filter((otau) => otau.playerId === playerId);

      return isOpponent ? [...otaus].reverse() : otaus;
    }, [gameDoc.board, playerId, isOpponent]);

    return (
      <div className="w-full flex justify-between items-center">
        {otauBalls?.map((otauBall, index) => (
          <Otau
            key={`${otauBall.playerId}-${otauBall.id}-${index}`}
            quantity={otauBall.count}
            isTuzdyq={otauBall.tuzdyq}
            isHighlighted={
              currentUserId === gameDoc.currentTurn && otauBall.hover
            }
            onClick={() => onOtauClick(otauBall)}
            onMouseEnter={() => onMouseEnter && onMouseEnter(otauBall)}
            onMouseLeave={() => onMouseLeave && onMouseLeave()}
          />
        ))}
      </div>
    );
  }
);
