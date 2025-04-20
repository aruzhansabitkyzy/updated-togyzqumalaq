interface InputProps {
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Input = ({ value, onChange, placeholder }: InputProps) => {
  return (
    <input
      className="bg-gray-100 w-[300px] h-[35px] rounded-md p-2.5 focus:outline-orange-200"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    ></input>
  );
};

export default Input;
