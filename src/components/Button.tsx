interface ButtonProps {
  text: string;
  additionalStyle?: string;
  onClick: () => void;
  disabled?: boolean
}

export const Button = ({ text, additionalStyle, onClick, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-orange-200 text-gray-900 font-semibold text-center p-3 h-auto rounded-md ${additionalStyle}`}
    >
      {text}
    </button>
  );
};
