export const formatAmount = (amount: string, input: string) => {
  switch (input) {
    case "delete": {
      if (amount.length === 1) {
        return 0;
      }
      let newStr = amount.slice(0, -1);
      if (!newStr.includes(",")) return newStr.length === 0 ? "0" : newStr;

      return amount;
    }
    case ".": {
      if (!amount.includes(".")) return [...amount, "."];
      return amount;
    }
    default:
      if (amount.length === 1 && amount[0] === "0") {
        return input;
      }
      return amount;
  }
};

export const formatGhostAmount = (amount: string) => {
  switch (amount.length) {
    case 0:
      return "0.00";
    case 1:
      return amount[0] !== "0" ? `${amount[0]}.00` : "0.00";
    case 2:
      return amount[1] !== "." ? amount : `${amount[0]}.00`;
    case 3:
      return amount[1] === "." ? `${amount[0]}.${amount[2]}0` : amount;
    default:
      return "";
  }
};

// function formatAmountInDigits(amount: string) {
//   const strValue = arr.join("").replace(",", "");

//   const num = new Intl.NumberFormat("en-EN").format(strValue);

//   if (num === "NaN") return false;

//   return num.split("");
// }
