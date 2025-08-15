export type IconSize = "medium" | "small" | "large";

export const getIconWrapperSize = (size: IconSize) => {
  switch (size) {
    case "small": {
      return "1.75rem";
    }
    case "medium": {
      return "2.75rem";
    }
    case "large": {
      return "3.5rem";
    }
    default: {
      throw new Error("Invalid size");
    }
  }
};

export const getIconSize = (size: IconSize) => {
  switch (size) {
    case "small": {
      return 16;
    }
    case "medium": {
      return 24;
    }
    case "large": {
      return 30;
    }
    default: {
      throw new Error("Invalid size");
    }
  }
};
