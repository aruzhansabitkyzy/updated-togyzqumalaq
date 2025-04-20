import { OtauInfo, GameData } from "../../types";

const getHint = (
  otau: OtauInfo,
  gameDoc: GameData,
  currentTurn: string,
  updateGameState: (data: Partial<GameData>) => void
) => {
  if (!gameDoc || otau.playerId !== currentTurn) return;

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

const clearHint = (
  gameDoc: GameData,
  updateGameState: (data: Partial<GameData>) => void
) => {
  if (!gameDoc) return;
  const newBoard = gameDoc.board.map((cell) => ({ ...cell, hover: false }));
  updateGameState({ board: newBoard });
};

export { getHint, clearHint };
