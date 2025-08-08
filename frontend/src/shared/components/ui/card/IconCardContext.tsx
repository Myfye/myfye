import { createContext } from "react";
import { IconCardContent } from "./IconCard";

export const IconCardContext = createContext<IconCardContent | null>(null);
