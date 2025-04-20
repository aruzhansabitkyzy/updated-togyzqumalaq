import { v4 as uuidv4 } from "uuid";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { initBoard } from "../utils/initialBoard";
import { Player, GameData, OtauInfo } from "../types";
import { db } from "../firebase";

export const lsGet = <T>(key: string, defaultValue: T) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const lsSet = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

interface CreateRoomParams {
  PLAYER_ONE: string;
  PLAYER_TWO: string;
  gameId: string;
}

export const initialBoardWithPlayersId = async (gameId: string) => {
  const gameData = await getData(gameId);
  const currentUserId = lsGet("userId", "");
  const opponentUser = gameData?.players.filter((player) => {
    return player.id !== currentUserId;
  })[0];

  const initialBoard = initBoard.map((otau, i) => {
    if (i >= 0 && i <= 8) {
      return {
        ...otau,
        playerId: currentUserId, // Just assign the ID string
      };
    } else {
      return {
        ...otau,
        playerId: opponentUser?.id || "-1", // Just assign the ID string
      };
    }
  });

  return initialBoard;
};

export const createRoom = async ({
  PLAYER_ONE,
  gameId,
}: CreateRoomParams): Promise<void> => {
  const player: Player = {
    id: uuidv4(),
    name: PLAYER_ONE,
    score: 0,
    tuzdyqOtauId: -1,
  };
  lsSet("userName", PLAYER_ONE);
  lsSet("userId", player.id);

  const boardWithPlayer1 = initBoard.map((otau, i) => {
    if (i >= 0 && i <= 8)
      return {
        ...otau,
        playerId: player.id,
      };
    return { ...otau };
  });

  const game: GameData = {
    gameId,
    status: "waiting",
    players: [player],
    board: boardWithPlayer1,
    currentTurn: player.id,
    winner: null,
  };

  try {
    const gameRef = doc(db, "room", gameId);
    await setDoc(gameRef, game);
  } catch (error) {
    console.error("Error creating room:", error);
  }
};

interface JoinRoomParams {
  room: string;
  name: string;
}

export const joinRoom = async ({
  room,
  name,
}: JoinRoomParams): Promise<string | void> => {
  lsSet("userName", name);
  const gameRef = doc(db, "room", room);
  const docSnap = await getDoc(gameRef);
  const gameData = docSnap.data();

  if (!gameData) {
    return "Not found";
  }

  const player: Player = {
    id: uuidv4(),
    name,
    score: 0,
    tuzdyqOtauId: -1,
  };

  lsSet("userId", player.id);

  const boardWithPlayers = gameData.board.map((otau: OtauInfo, i: number) => {
    if (otau.playerId === "-1") {
      return {
        ...otau,
        playerId: player.id,
      };
    }
    return otau;
  });

  if (gameData.status === "waiting") {
    await updateDoc(gameRef, {
      board: boardWithPlayers,
      status: "ready",
      players: arrayUnion(player),
      currentTurn: player.id,
    });
  }
};

interface LeaveRoomParams {
  room: string;
}

export const leaveRoom = async ({
  room,
}: LeaveRoomParams): Promise<string | void> => {
  const user = lsGet("userId", "");
  const gameData = await getData(room);
  const gameRef = doc(db, "room", room);

  if (!gameData) {
    return "Not found";
  }

  const player = gameData.players.find((p: Player) => p.id === user);

  const updatedBoard = gameData.board.map((otau: OtauInfo) => {
    if (otau.playerId === user) {
      return {
        ...otau,
        tuzdyq: false,
        count: 9,
        playerId: "-1",
      };
    }
    return {
      ...otau,
      tuzdyq: false,
      count: 9,
    };
  });

  const updatedPlayers = gameData.players
    .filter((p: Player) => p.id !== user)
    .map((p: Player) => ({
      ...p,
      score: 0,
      tuzdyqOtauId: -1,
    }));

  await updateDoc(gameRef, {
    board: updatedBoard,
    status: "waiting",
    players: updatedPlayers,
    currentTurn: updatedPlayers[0],
  });

  if (gameData.players.length === 1) {
    await deleteDoc(gameRef);
  }
};

interface ResetGameParams {
  room: string;
}

export const resetGame = async ({
  room,
}: ResetGameParams): Promise<string | void> => {
  const gameRef = doc(db, "room", room);
  const docSnap = await getDoc(gameRef);
  const gameData = docSnap.data();

  if (!gameData) {
    console.log("Room not found");
    return "Not found";
  }

  const board = await initialBoardWithPlayersId(room);

  await updateDoc(gameRef, {
    board: board,
    winner: null,
    players: gameData.players.map((player: Player) => {
      return { ...player, score: 0, tuzdyqOtauId: -1 };
    }),
  });
};

export const getData = async (
  gameId: string
): Promise<GameData | undefined> => {
  const docRef = doc(db, "room", gameId);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as GameData;
};

interface UpdateDataParams {
  gameId: string;
  data: Partial<GameData>;
}

export const updateData = async ({
  gameId,
  data,
}: UpdateDataParams): Promise<void> => {
  const gameRef = doc(db, "room", gameId);
  await updateDoc(gameRef, data);
};
