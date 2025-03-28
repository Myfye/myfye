export const formatAmountLabel = (amountLabel: string, input: string) => {
  console.log(amountLabel, input);
  switch (input) {
    case "delete": {
      if (amountLabel.length === 1) {
        return "0";
      }
      const newStr = amountLabel.slice(0, -1);
      if (!newStr.includes(",")) return newStr.length === 0 ? "0" : newStr;
      return amountLabel;
    }
    case ".": {
      if (!amountLabel.includes(".")) return amountLabel + ".";
      return amountLabel;
    }
    default:
      if (amountLabel.length === 1 && amountLabel[0] === "0") {
        return input;
      }
      return amountLabel + input;
  }
};

export const formatGhostAmountLabel = (amountLabel: string) => {
  switch (amountLabel.length) {
    case 0:
      return "0.00";
    case 1:
      return amountLabel[0] !== "0" ? `${amountLabel[0]}.00` : "0.00";
    case 2:
      return amountLabel[1] !== "." ? amountLabel : `${amountLabel[0]}.00`;
    case 3:
      return amountLabel[1] === "."
        ? `${amountLabel[0]}.${amountLabel[2]}0`
        : amountLabel;
    default:
      return "";
  }
};

export const parseAmountLabel = (amountLabel: string) => {
  return parseFloat(amountLabel.replace(/,/g, ""));
};
