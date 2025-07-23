import { createContext } from "react";

export const ButtonGroupContext = createContext<{
  size: "x-small" | "small" | "medium" | "large" | "x-large";
  expand: boolean;
}>({
  size: "medium",
  expand: false,
});
