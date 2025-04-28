import { BallRendering } from "../BallsRendering";

export default function Qazandyq({ quantity }: { quantity: number }) {
  return (
    <div className="w-full h-24 bg-orange-50 rounded-md relative p-3">
      <div className="absolute top-0 right-0 size-7 bg-white shadow-md rounded-full text-center z-10 bg-opacity-50">
        <p className="!opacity-100 font-semibold">{quantity}</p>
      </div>
      {quantity > 0 && (
        <BallRendering
          count={Math.min(quantity, 70)}
          isHorizontal
          gap="gap-3"
          flex="justify-between w-full"
          spaceY="space-x-2"
        />
      )}
      {quantity > 70 && (
        <BallRendering
          isHorizontal
          count={Math.min(quantity - 70, 70)}
          gap="gap-0"
          spaceY="space-x-2"
          flex="justify-between"
          position="absolute top-3 left-6"
        />
      )}
      {quantity > 140 && (
        <BallRendering
          isHorizontal
          count={quantity - 140}
          gap="gap-2"
          spaceY="space-x-2"
          flex="justify-between"
          position="absolute top-3 left-8"
        />
      )}
    </div>
  );
}
