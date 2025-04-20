import { useState, useEffect } from "react";

export const Popup = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute top-0 right-0 z-1000 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 relative animate-fade-in">
        {text}
      </div>
    </div>
  );
};
