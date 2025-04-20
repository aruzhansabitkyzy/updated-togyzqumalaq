import React from "react";
import { Ball } from "./ui/Ball";

export const BallRendering: React.FC<{
  count?: number;
  isHorizontal?: boolean;
  gap?: string;
  flex?: string;
  position?: string;
  spaceY?: string;
}> = React.memo(
  ({
    count = 0,
    isHorizontal = false,
    gap = "",
    flex = "",
    position = "",
    spaceY = "",
  }) => {
    const firstRowCount = Math.ceil(count / 2);
    const secondRowCount = Math.floor(count / 2);

    return (
      <div
        className={`flex ${
          isHorizontal ? "flex-col" : ""
        } ${gap} ${flex} ${position} items-center`}
      >
        <div className={`flex ${!isHorizontal ? "flex-col" : ""} ${spaceY}`}>
          {Array.from({ length: firstRowCount }).map((_, i) => (
            <Ball key={`first-${i}`} />
          ))}
        </div>
        <div className={`flex ${!isHorizontal ? "flex-col" : ""} ${spaceY}`}>
          {Array.from({ length: secondRowCount }).map((_, i) => (
            <Ball key={`second-${i}`} />
          ))}
        </div>
      </div>
    );
  }
);
