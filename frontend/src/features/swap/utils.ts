export const formatAmountLabel = (
  amountLabel: string,
  input: string,
  replace?: boolean
) => {
  if (replace)
    return parseAmountLabel(input).toLocaleString("en-EN", {
      maximumFractionDigits: 8,
    });
  switch (input) {
    case "delete": {
      if (amountLabel === "0.") return "";
      amountLabel = amountLabel.slice(0, -1);
      const parsedLabel = parseAmountLabel(amountLabel);
      amountLabel = isNaN(parsedLabel) ? (amountLabel = "") : amountLabel;
      if (!amountLabel) return amountLabel;
      amountLabel = parseAmountLabel(amountLabel).toLocaleString("en-EN", {
        maximumFractionDigits: 8,
      });
      return amountLabel.length === 0 ? "" : amountLabel;
    }
    case ".": {
      if (amountLabel.length === 0) return "0.";
      if (!amountLabel.includes(".")) return amountLabel + ".";
      return amountLabel;
    }
    default:
      if (amountLabel.length === 1 && amountLabel[0] === "0") {
        return input;
      }
      amountLabel = amountLabel + input;

      amountLabel = parseAmountLabel(amountLabel).toLocaleString("en-EN", {
        maximumFractionDigits: 8,
      });
      return amountLabel;
  }
};

export const formatGhostAmountLabel = (amountLabel: string) => {
  switch (amountLabel.length) {
    case 0:
      return "0";
    default:
      return amountLabel;
  }
};

export const parseAmountLabel = (amountLabel: string) => {
  return parseFloat(amountLabel.replace(/,/g, ""));
};
