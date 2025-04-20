import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";
import { GameData } from "../types";

export const useGameSync = () => {
  const location = useLocation();
  const [gameDoc, setGameDoc] = useState<GameData | null>(null);

  const gameId = new URLSearchParams(location.search).get("gameId");

  useEffect(() => {
    if (!gameId) return;

    const gameRef = doc(db, "room", gameId);

    const unsubscribe = onSnapshot(
      gameRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as GameData;
          setGameDoc(data);
          // console.log("Game data updated:", data);
        } else {
          // console.log("Game document doesn't exist!");
        }
      },
      (error) => {
        console.error("Error listening to game updates:", error);
      }
    );

    return () => {
      console.log("Unsubscribing from game updates");
      unsubscribe();
    };
  }, [gameId]);

  const updateGameState = async (updates: Partial<GameData>) => {
    if (!gameId) {
      console.error("Cannot update game state: No gameId available");
      return;
    }

    const gameRef = doc(db, "room", gameId);
    try {
      console.log("Updating game state with:", updates);
      await updateDoc(gameRef, updates);
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };

  return {
    gameId,
    gameDoc,
    updateGameState,
  };
};
