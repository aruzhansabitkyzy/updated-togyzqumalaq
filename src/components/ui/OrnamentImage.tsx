const OrnamentImage = (props: { width: number; height: number; style?: string }) => {
  return (
    <img
      src={"/assets/ornament4.png"}
      alt=""
      width={props.width}
      height={props.height}
      style={{ transform: props.style }}
    />
  );
};

export default OrnamentImage;
