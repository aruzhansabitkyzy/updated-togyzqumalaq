import { GameData, OtauInfo, Player } from "../../types";
import { deepCopy, findSelectedOtauIndex } from "../../utils";
import { GAME_CONSTANTS } from "../constants/gameConstants";

const spreadQumalaqs = (
  qumalaqs: number,
  initialIndex: number,
  board: OtauInfo[],
  players: Player[]
) => {
  while (qumalaqs > 0) {
    initialIndex = (initialIndex + 1) % board.length;

    const player1 = players[0];
    const player2 = players.length > 1 ? players[1] : null;

    const player1TuzdyqIndex = player1.tuzdyqOtauId;
    const player2TuzdyqIndex = player2?.tuzdyqOtauId;

    if (
      (player1TuzdyqIndex !== -1 && initialIndex === player1TuzdyqIndex) ||
      (player2TuzdyqIndex !== -1 && initialIndex === player2TuzdyqIndex)
    ) {
      const tuzdyqOwnerId =
        initialIndex === player1TuzdyqIndex ? player1.id : player2?.id;

      const playerIndex = players.findIndex((p: any) => p.id === tuzdyqOwnerId);
      if (playerIndex !== -1) {
        players[playerIndex].score += 1;
      }

      continue;
    }

    board[initialIndex].count++;
    qumalaqs--;
  }
  return initialIndex;
};

const performMove = (
  gameData: GameData,
  selectedOtau: OtauInfo,
  currentTurn: string,
  currentUserId: string
) => {
  const newBoard = deepCopy(gameData.board);
  const updatedPlayers = deepCopy(gameData.players);

  const startIndex = findSelectedOtauIndex(newBoard, selectedOtau);

  if (startIndex === -1)
    return { newBoard: null, nextTurn: gameData.currentTurn, updatedPlayers };

  let qumalaqs = newBoard[startIndex].count;
  newBoard[startIndex].count = 1;
  qumalaqs--;

  let currentIndex = startIndex;

  const lastIndex = spreadQumalaqs(
    qumalaqs,
    currentIndex,
    newBoard,
    updatedPlayers
  );

  const endOtau = newBoard[lastIndex];
  const currentPlayerIndex = updatedPlayers.findIndex(
    (p: any) => p.id === currentTurn
  );
  const isTuzdyq = newBoard[lastIndex].tuzdyq;
  const noTuzdyqForCurrentPlayer =
    updatedPlayers[currentPlayerIndex].tuzdyqOtauId === -1;
  const isValidPlayerForOtau = !isTuzdyq && currentPlayerIndex !== -1;

  if (isValidPlayerForOtau && endOtau.playerId !== currentTurn) {
    if (endOtau.count % 2 === 0) {
      updatedPlayers[currentPlayerIndex].score += endOtau.count;
      newBoard[lastIndex].count = 0;
    } else if (
      endOtau.count === GAME_CONSTANTS.TUZDYQ_CAPTURE_COUNT &&
      noTuzdyqForCurrentPlayer
    ) {
      newBoard[lastIndex].tuzdyq = true;
      updatedPlayers[currentPlayerIndex].tuzdyqOtauId = lastIndex;
      updatedPlayers[currentPlayerIndex].score +=
        GAME_CONSTANTS.TUZDYQ_CAPTURE_COUNT;
    }
  }

  const nextTurn = getNextTurn(currentTurn, updatedPlayers);

  return { newBoard, nextTurn, updatedPlayers };
};

const getNextTurn = (
  currentTurnId: string | undefined,
  updatedPlayers: Player[]
) => {
  if (!currentTurnId) return updatedPlayers[0].id;

  if (updatedPlayers.length > 1) {
    return (
      updatedPlayers.find((p: any) => p.id !== currentTurnId)?.id ||
      currentTurnId
    );
  }
  return currentTurnId;
};

const isGameOver = (
  gameDoc: GameData,
  updateGameState: (data: Partial<GameData>) => void,
  setModalOpen: (value: boolean) => void,
  players: Player[]
) => {
  if (!gameDoc) return;

  const [player1, player2] = players;
  const board = gameDoc.board;

  const countVulnerableOtaus = (playerId: string): number => {
    return board.filter(
      (otau) =>
        otau.playerId === playerId &&
        !otau.tuzdyq &&
        otau.count === GAME_CONSTANTS.MIN_OTAU_COUNT
    ).length;
  };

  const isPlayer1Lose = countVulnerableOtaus(player1.id) === 9;
  const isPlayer2Lose = player2 && countVulnerableOtaus(player2?.id) === 9;

  const isPlayer1Winner = player1?.score >= GAME_CONSTANTS.WINNING_SCORE;
  const isPlayer2Winner =
    player2 && player2?.score >= GAME_CONSTANTS.WINNING_SCORE;

  if (isPlayer1Lose || isPlayer2Winner) {
    updateGameState({
      winner: player2,
      status: "completed",
    });
    setModalOpen(true);
  } else if (isPlayer2Lose || isPlayer1Winner) {
    updateGameState({
      winner: player1,
      status: "completed",
    });
    setModalOpen(true);
  }
};

export { isGameOver, performMove };
