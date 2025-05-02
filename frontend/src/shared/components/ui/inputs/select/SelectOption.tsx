import { MouseEventHandler, ReactNode } from "react";

type SelectOptionProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

const SelectOption = ({ onClick, children }: SelectOptionProps) => {
  return (
    <button
      type="submit"
      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      role="menuitem"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SelectOption;
