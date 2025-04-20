import { BallRendering } from "../BallsRendering";

export default function Qazandyq({ quantity }: { quantity: number }) {
  return (
    <div className="w-full h-20 bg-orange-50 rounded-md relative p-3">
     <div className="absolute top-0 right-0 size-7 bg-white shadow-md rounded-full text-center z-10 bg-opacity-50">
        <p className="!opacity-100 font-semibold">{quantity}</p>
      </div>
      <BallRendering
        count={quantity}
        isHorizontal
        gap="gap-3"
        flex="justify-between w-full"
        spaceY="space-x-2"
      />
    </div>
  );
}
