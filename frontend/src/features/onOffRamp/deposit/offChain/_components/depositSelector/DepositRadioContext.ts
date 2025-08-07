import { createContext } from "react";
import { RadioGroupState } from "react-stately";

export const DepositRadioContext = createContext<RadioGroupState | null>(null);
