import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import Confetti from "react-confetti";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  title?: string;
  message?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showConfetti?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAction,
  title,
  message,
  primaryButtonText = "Confirm",
  secondaryButtonText = "Cancel",
  showConfetti = false
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 p-6 relative animate-fade-in shadow-xl">
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">{title}</h2>
        )}
        {message && (
          <p className="text-lg text-center mb-6">{message}</p>
        )}
        <div className="flex justify-center gap-5 items-center">
          {onAction && (
            <Button onClick={onAction} text={primaryButtonText} />
          )}
          <Button onClick={onClose} text={secondaryButtonText} />
        </div>
      </div>
    </div>
  );
};

export default Modal;