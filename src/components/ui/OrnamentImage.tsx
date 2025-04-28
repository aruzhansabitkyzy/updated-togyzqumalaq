const OrnamentImage = (props: {
  width: number;
  height: number;
  style?: string;
}) => {
  return (
    <img
      src={"/assets/ornament.png"}
      alt=""
      width={props.width}
      height={props.height}
      style={{ transform: props.style, filter: "invert(1)" }}
    />
  );
};

export default OrnamentImage;
