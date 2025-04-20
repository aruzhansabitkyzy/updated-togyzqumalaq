import { BallType } from "../../types";

const COLOR = {
  tuzdyq: "bg-red-500",
  regular: "bg-yellow-950",
};

export const Ball = ({ type ='regular' }: { type?: BallType }) => {
  return <div className={`${COLOR[type]} size-5 rounded-full border border-solid border-orange-200 shadow-md`}></div>;
};
