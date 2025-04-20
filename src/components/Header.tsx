import { useNavigate, useSearchParams } from "react-router-dom";
import OrnamentSquare from "./OrnamentSquare";
import CopyButton from "./ui/CopyButton";
export const Header = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");

  return (
    <div className="w-full flex items-center justify-between h-30 bg-gray-900 py-10 px-4 text-orange-200">
      <div className="flex gap-3 items-center">
        <OrnamentSquare />
        <p className="font-bold text-3xl">Togyzqumalaq</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-white bg-opacity-50 rounded-lg px-3 py-2 font-semibold cursor-pointer">
          <p className="text-black">Theme</p>
        </div>
        {gameId && <CopyButton textToCopy={gameId} />}
      </div>
    </div>
  );
};
