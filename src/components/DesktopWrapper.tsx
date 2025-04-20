import { useState, useEffect } from "react";

const DesktopOnlyWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-100 text-lg font-semibold text-red-600">
        This game is only available on desktop.
      </div>
    );
  }

  return <>{children}</>;
};

export default DesktopOnlyWrapper;
