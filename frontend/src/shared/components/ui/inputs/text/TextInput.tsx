"use client";

import { ComponentPropsWithoutRef, forwardRef, useId } from "react";
import Input from "../Input";

interface TextInputProps extends ComponentPropsWithoutRef<"input"> {
  unit?: string;
  label: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ unit, label, ...props }, ref) {
    const id = useId();

    return (
      <Input label={label} id={id}>
        <div
          className="wrapper | grid items-center  gap-1"
          style={{ gridTemplateColumns: "1fr auto" }}
        >
          <input
            ref={ref}
            className={`relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6`}
            type="text"
            id={id}
            {...props}
          />
          {unit === "mm" && <span className="text-xs text-gray-500">mm</span>}
        </div>
      </Input>
    );
  }
);

export default TextInput;
