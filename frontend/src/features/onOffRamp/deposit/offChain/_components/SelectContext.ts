import { createContext } from "react";
import { RadioGroupState } from "react-stately";

export const SelectContext = createContext<RadioGroupState | null>(null);
