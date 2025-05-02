"use client";

import { useEffect, useId, useRef, useState } from "react";
import SelectOption from "./SelectOption";
import Input from "../Input";

export type SelectOptionType = {
  label: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  options: SelectOptionType[];
  isActive: boolean;
  onChangeCurrentOption: (option: SelectOptionType) => void;
  readOnly?: boolean;
  initialOption: SelectOptionType;
  currentOption: SelectOptionType | null;
};
const SelectInput = ({
  label,
  options,
  isActive,
  onChangeCurrentOption,
  readOnly,
  initialOption,
  currentOption,
}: SelectInputProps) => {
  // Dropdown
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLButtonElement>(null!);

  const id = useId();

  function toggleOpen() {
    if (!isActive || readOnly) return;
    setOpen((open) => !open);
  }

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) window.addEventListener("click", close);
    return () => {
      window.removeEventListener("click", close);
    };
  }, [open]);

  const optionsComponents = options.map(({ label, value }, i) => {
    if (isActive) {
      return (
        <SelectOption
          key={`${label}-${i}`}
          onClick={(e) => {
            e.preventDefault();
            onChangeCurrentOption({ label, value });
          }}
        >
          {label}
        </SelectOption>
      );
    }
  });

  return (
    <Input id={id} label={label}>
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="menu-button"
            aria-expanded={open}
            aria-haspopup="true"
            onClick={toggleOpen}
            ref={dropdownRef}
          >
            {isActive && (currentOption?.label || initialOption?.label)}
            <svg
              className="-mr-1 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            open
              ? "pointer-events-auto transition ease-out duration-100 transform opacity-100 scale-100"
              : "pointer-events-none transition ease-in duration-75 transform opacity-0 scale-95"
          } absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 scale-95 pointer-events-none focus:outline-none"`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {...optionsComponents}
          </div>
        </div>
      </div>
    </Input>
  );
};

export default SelectInput;
