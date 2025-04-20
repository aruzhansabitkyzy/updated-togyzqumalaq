import { useEffect } from "react";

export const Popup = ({
  text,
  isVisible,
  removeVisibility,
}: {
  text: string;
  isVisible: boolean;
  removeVisibility: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeVisibility();
    }, 2000);

    return () => clearTimeout(timer);
  });

  if (!isVisible) return null;

  return (
    <div className="absolute top-32 right-0 z-1000 flex items-center justify-center">
      <div className="border border-2 border-gray-200 bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 relative animate-fade-in">
        {text}
      </div>
    </div>
  );
};
