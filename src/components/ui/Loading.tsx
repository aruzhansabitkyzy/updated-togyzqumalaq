import OrnamentImage from "./OrnamentImage";

const Loading = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <span className="inline-block animate-spin">
        <OrnamentImage width={200} height={200} />
      </span>
    </div>
  );
};

export default Loading;
