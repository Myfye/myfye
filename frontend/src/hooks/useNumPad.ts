import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

const useNumPad = () => {
  const [value, setValue] = useState("0");

  // Zod schema for partial input validation (in-progress input, e.g., "12.", "12.3")
  const partialSchema = z.string().regex(/^\d{1,3}(,\d{3})*(\.\d{0,2})?$/, {
    message: "Invalid input: must be a valid money amount",
  });

  // Zod schema for final validation (completed input, e.g., "12.34")
  const finalSchema = z.string().regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, {
    message: "Invalid final input: must be a valid money amount",
  });

  const handleInput = (input: string) => {
    let newValue;

    if (input === "." && value === "0") {
      newValue = "0."; // Allow "0." when "." is pressed as the first input
    } else if (input === "." && value.includes(".")) {
      return; // Prevent multiple decimal points
    } else if (value === "0") {
      newValue = input; // Replace "0" with the first valid input
    } else {
      newValue = value + input; // Append the input to the current value
    }

    try {
      partialSchema.parse(newValue); // Validate partial input
      setValue(newValue);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err.issues);
      }
    }
  };

  const handleBackspace = () => {
    if (value.length > 1) {
      const newValue = value.slice(0, -1);
      setValue(newValue);
    } else {
      setValue("0"); // Set to 0 if everything is deleted
    }
  };

  const formatValue = (input: string) => {
    if (!input || input === "0") return "0"; // Ensure empty inputs become 0
    const [integerPart, decimalPart] = input.split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  const handleSubmit = () => {
    try {
      finalSchema.parse(value);
      setValue(formatValue(value));
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err.issues);
      }
      setValue("0");
    }
  };

  //   const handleValidationOnBlur = () => {
  //     try {
  //       finalSchema.parse(value); // Validate the final input
  //       setValue(formatValue(value)); // Format correctly if valid
  //     } catch (err) {
  //       console.error(err.message);
  //       setValue("0"); // Reset to 0 if invalid
  //     }
  //   };

  return {
    value,
    handleInput,
    handleBackspace,
    handleSubmit,
    // handleValidationOnBlur,
  };
};
