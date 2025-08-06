import { createContext } from "react";
import { RadioGroupState } from "react-stately";

export const AmountSelectContext = createContext<RadioGroupState | null>(null);
