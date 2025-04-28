import { Ball } from "./Ball";
import { BallRendering } from "../BallsRendering";

interface OtauProps {
  quantity: number;
  isTuzdyq?: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Otau({
  quantity,
  isTuzdyq = false,
  isHighlighted = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: OtauProps) {
  const highlight = "!border-yellow-500";

  return (
    <div
      className={`bg-orange-50 rounded-md p-3 h-44 w-20 relative cursor-pointer shadow-md border-2 border-solid border-gray-500 overflow-hidden ${
        isHighlighted && highlight
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute top-0 right-0 size-7 bg-white shadow-md rounded-full text-center z-10 bg-opacity-50">
        <p className="!opacity-100 font-semibold">
          {isTuzdyq ? "☆" : quantity}
        </p>
      </div>
      {isTuzdyq ? (
        <Ball type="tuzdyq" />
      ) : (
        <>
          {quantity > 0 && (
            <BallRendering
              count={Math.min(quantity, 10)}
              gap="gap-3"
              spaceY="space-y-2"
              flex="justify-between"
            />
          )}
          {quantity > 10 && (
            <BallRendering
              count={Math.min(quantity - 10, 10)}
              gap="gap-0"
              spaceY="space-y-2"
              flex="justify-between"
              position="absolute top-8 left-6"
            />
          )}
          {quantity > 20 && (
            <BallRendering
              count={quantity - 20}
              gap="gap-2"
              spaceY="space-y-2"
              flex="justify-between"
              position="absolute top-8 left-8"
            />
          )}
        </>
      )}
    </div>
  );
}
