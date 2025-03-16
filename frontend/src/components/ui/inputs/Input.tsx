import { ReactNode } from "react";

type InputProps = {
  label: string;
  children: ReactNode;
  id: string;
};

const Input = ({ label, children, id }: InputProps) => {
  return (
    <div className="wrapper">
      <label
        className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
        htmlFor={id}
      >
        {label}
      </label>
      {children}
    </div>
  );
};

export default Input;
