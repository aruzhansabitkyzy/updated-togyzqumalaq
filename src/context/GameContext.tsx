// import React, { useEffect, useState } from "react";
// import { useGameSync } from "../hooks/useGameSync";
// import { lsGet } from "../services/api";
// import { Player } from "../types";
// import { db } from "../firebase";
// import { doc, getDoc } from "@firebase/firestore";

// export function MyGameContextProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { gameDoc } = useGameSync();
//   const [opponentUser, setOpponentUser] = useState<Player | null>(null);

//   useEffect(() => {
//     if (gameDoc) {
//       const currentUserId = lsGet("userId", "");
//       const opponentUser = gameDoc?.players.filter((player) => {
//         return player.id !== currentUserId;
//       })[0];
//       setOpponentUser(opponentUser);
//     }
//   }, [gameDoc]);

//   const setRoom = async (roomId: string) => {
//     const docRef = doc(db, "room", roomId);
//     const docSnap = await getDoc(docRef);
//     const data = docSnap.data();

//     return { docRef, docSnap, data };
//   };

//   return (
//     <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
//   );
// }

export const GameContext = () => {
  return <></>;
};
