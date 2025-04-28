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
import { Player, GameData, OtauInfo, GameParams } from "../types";
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
  const { data } = await getData(gameId);
  const currentUserId = lsGet("userId", "");
  const opponentUser = data?.players.filter((player) => {
    return player.id !== currentUserId;
  })[0];

  const initialBoard = initBoard.map((otau, i) => {
    if (i >= 0 && i <= 8) {
      return {
        ...otau,
        playerId: currentUserId,
      };
    } else {
      return {
        ...otau,
        playerId: opponentUser?.id || "-1",
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
  lsSet("id", room);
  const gameRef = doc(db, "room", room);
  const docSnap = await getDoc(gameRef);
  const gameData = docSnap.data();

  if (!gameData) {
    return "Not found";
  }
  if (gameData.players.length >= 2) {
    alert("Room is full");
    return "Room is full";
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

export const leaveRoom = async ({
  room,
}: GameParams): Promise<string | void> => {
  try {
    const user = lsGet("userId", "");

    if (!user) {
      console.error("No user ID found in local storage");
      return "No user ID found";
    }

    if (!room) {
      console.error("No room ID provided");
      return "No room ID provided";
    }

    console.log("Attempting to leave room:", room, "User:", user);

    const { data, gameRef } = await getData(room);

    if (!data || !gameRef) {
      console.error("Failed to retrieve game data or reference");
      return "Game not found or error occurred";
    }

    const updatedBoard = data.board.map((otau) => {
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
        playerId: otau.playerId,
      };
    });

    const removingPlayer = data.players.find((p) => p.id === user);
    arrayRemove(removingPlayer);
    const updatedPlayers = {
      ...data.players[0],
      tuzdyqOtauId: -1,
      score: 0,
    };

    const newCurrentTurn = updatedPlayers?.id;

    if (data?.players?.length === 0) {
      await deleteDoc(gameRef);
    } else {
      const updatedGameData = {
        ...data,
        board: updatedBoard,
        status: "waiting",
        players: [updatedPlayers],
        currentTurn: newCurrentTurn,
      };

      await setDoc(gameRef, updatedGameData, { merge: true });
    }

    return "Successfully left game";
  } catch (error) {
    return `Error leaving game: ${error}`;
  }
};

export const resetGame = async ({
  room,
}: GameParams): Promise<string | void> => {
  const docRef = doc(db, "room", room);
  const docSnap = await getDoc(docRef);
  const gameData = docSnap.data();

  if (!gameData) {
    console.log("Room not found");
    return "Not found";
  }

  const board = await initialBoardWithPlayersId(room);

  await updateDoc(docRef, {
    board: board,
    winner: null,
    players: gameData.players.map((player: Player) => {
      return { ...player, score: 0, tuzdyqOtauId: -1 };
    }),
  });
};

export const getData = async (gameId: string) => {
  try {
    // Validate the gameId
    if (!gameId || typeof gameId !== "string") {
      console.error("Invalid gameId provided to getData:", gameId);
      return { data: null, gameRef: null };
    }

    // Get reference and snapshot
    const gameRef = doc(db, "room", gameId);
    const docSnap = await getDoc(gameRef);

    // Check if document exists
    if (!docSnap.exists()) {
      console.error("Game document does not exist:", gameId);
      return { data: null, gameRef };
    }

    // Get the data
    const data = docSnap.data() as GameData;
    console.log("Game data retrieved:", JSON.stringify(data));

    return { data, gameRef };
  } catch (error) {
    console.error("Error in getData:", error);
    return { data: null, gameRef: null };
  }
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
