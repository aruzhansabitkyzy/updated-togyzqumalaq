import { useSearchParams } from "react-router-dom";
import OrnamentSquare from "./OrnamentSquare";
import CopyButton from "./ui/CopyButton";
export const Header = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");

  return (
    <div className="w-full flex items-center justify-between h-30 bg-gray-900 py-10 px-4 text-orange-200">
      <div className="flex gap-3 items-center">
        <OrnamentSquare />
        <p className="font-bold text-3xl">TOGYZQUMALAQ</p>
      </div>
      <div className="flex items-center gap-3">
        {gameId && <CopyButton textToCopy={gameId} />}
      </div>
    </div>
  );
};
