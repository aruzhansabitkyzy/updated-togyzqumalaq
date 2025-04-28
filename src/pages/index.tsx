import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button";
import Input from "../components/ui/Input";
import { createRoom, joinRoom, lsGet, lsSet } from "../services/api";
import Loading from "../components/ui/Loading";

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [creator, setCreator] = useState("");
  const [joiner, setJoiner] = useState("");
  const [room, setRoom] = useState("");

  const mutationCreate = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      const gameId = lsGet("id", "");
      navigate(`/game?gameId=${gameId}`);
    },
  });

  const mutationJoin = useMutation({
    mutationFn: joinRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", room] });
      navigate(`/game?gameId=${room}`);
    },
  });

  const handleCreate = () => {
    if (!creator.trim()) return;

    const gameId = `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    lsSet("id", gameId);

    mutationCreate.mutate({
      PLAYER_ONE: creator,
      PLAYER_TWO: "Waiting...",
      gameId,
    });
  };

  const handleJoin = () => {
    if (!room.trim() || !joiner.trim()) return;

    mutationJoin.mutate({
      room,
      name: joiner,
    });
  };

  return (
    <div className="flex items-center justify-between p-5 bg-gray-300 h-[calc(100vh-120px)]">
      {(mutationCreate.isPending || mutationJoin.isPending) && <Loading />}

      <div className="flex flex-col gap-5 justify-center w-1/2 h-full">
        <h1 className="text-xl">Welcome to Togyzqumalaq Online!</h1>
        <h2>
          Discover and master the traditional Kazakh game of strategy and skill!
        </h2>
        <h4>
          Togyzqumalaq is a time-honored game played between two people on a
          unique board. Immerse yourself in the rich culture of Kazakhstan while
          challenging your strategic thinking and decision-making skills.
        </h4>
        <Button
          text={"Rules"}
          onClick={() => navigate("/rules")}
          additionalStyle="w-fit bg-transparent text-gray-900 py-1 border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
        />
      </div>

      <div className="w-1/2 flex flex-col gap-10 items-center">
        <div className="flex flex-col gap-3">
          <label>Player Name:</label>
          <Input
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="Enter Your Name"
          />
          <Button text="Create a room" onClick={handleCreate} />
        </div>

        <div className="flex flex-col gap-3">
          <label>Player Name:</label>
          <Input
            value={joiner}
            onChange={(e) => setJoiner(e.target.value)}
            placeholder="Enter Your Name"
          />
          <label>Room ID:</label>
          <Input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter Room ID"
          />
          <Button text="Join a room" onClick={handleJoin} />
        </div>
      </div>
    </div>
  );
}
