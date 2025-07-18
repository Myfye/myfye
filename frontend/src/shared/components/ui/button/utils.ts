import { ButtonSize } from "./types";

export const getIconSize = (size: ButtonSize, iconOnly?: boolean) => {
  switch (size) {
    case "x-small": {
      return !iconOnly ? 16 : 16;
    }
    case "small": {
      return !iconOnly ? 16 : 18;
    }
    case "medium": {
      return !iconOnly ? 18 : 20;
    }
    case "large": {
      return !iconOnly ? 20 : 24;
    }
  }
};
