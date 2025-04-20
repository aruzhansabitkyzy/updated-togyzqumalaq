import React, { useEffect } from "react";
import { Button } from "../Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAction, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-1000 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 relative animate-fade-in">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div className="flex justify-between items-center">
          <Button onClick={onAction} text={"Confirm"} />
          <Button onClick={onClose} text={"Cancel"} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
