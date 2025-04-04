import { UserWalletDataState } from "@/redux/userWalletData";
import { Coin, CoinId } from "./swapSlice";
import { User } from "@privy-io/react-auth";

// Helper function to parse and format the amount
const getFormattedNumberFromString = (amount: string): string => {
  const parsed = parseFormattedAmount(amount);
  return isNaN(parsed)
    ? ""
    : parsed.toLocaleString("en-EN", { maximumFractionDigits: 8 });
};

export const changeFormattedAmount = (
  formattedAmount: string,
  input: string | number,
  replace?: boolean
): string => {
  // make sure input is a string
  input = input.toString();

  if (replace) {
    return getFormattedNumberFromString(input);
  }

  if (input === "delete") {
    if (formattedAmount === "0.") return "";
    const [integer, decimal] = formattedAmount.split(".");
    const newAmount = formattedAmount.slice(0, -1);
    if (
      decimal &&
      (decimal[decimal.length - 1] === "0" ||
        decimal[decimal.length - 2] === "0")
    )
      return newAmount;
    const newStr = getFormattedNumberFromString(newAmount);
    return newStr;
  }

  if (input === ".") {
    if (formattedAmount === "") return "0.";
    return formattedAmount.includes(".")
      ? formattedAmount
      : formattedAmount + ".";
  }

  if (input === "0" && formattedAmount === "") return "0.";
  if (formattedAmount === "0") return input; // Replace leading zero with input

  const updatedAmount = getFormattedNumberFromString(formattedAmount + input);
  if (input === "0" && formattedAmount.includes(".")) {
    formattedAmount += "0";
    const [_, decimal] = formattedAmount.split(".");
    const [updatedAmountInteger, __] = updatedAmount.split(".");
    return updatedAmountInteger + "." + decimal;
  }
  return updatedAmount;
};

export const changeFormattedGhostAmount = (formattedGhostAmount: string) => {
  switch (formattedGhostAmount.length) {
    case 0:
      return "0";
    default:
      return formattedGhostAmount;
  }
};

export const parseFormattedAmount = (formattedAmount: string) => {
  return parseFloat(formattedAmount.replace(/,/g, ""));
};

export const getUsdAmount = (
  coinId: CoinId | null,
  wallet: UserWalletDataState,
  amount: number | null
) => {
  if (!amount) return 0;
  switch (coinId) {
    case "btcSol": {
      return amount * wallet.priceOfBTCinUSDC;
    }
    case "sol": {
      return amount * 100;
    }
    case "usdcSol": {
      return amount;
    }
    case "usdtSol": {
      return amount;
    }
    case "eurcSol": {
      return amount * wallet.priceOfEURCinUSDC;
    }
    case "usdySol": {
      return amount * wallet.priceOfUSDYinUSDC;
    }
    default: {
      // return 0 if coin is null
      return 0;
    }
  }
};

export const formatUsdAmount = (amount: number | null) =>
  amount
    ? new Intl.NumberFormat("en-EN", {
        currency: "usd",
        style: "currency",
        maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      }).format(amount)
    : "$0";

export const getCoinBalance = (wallet: UserWalletDataState, coinId: CoinId) => {
  console.log("coinID", coinId);
  switch (coinId) {
    case "btcSol": {
      return wallet.btcSolBalance;
    }
    case "sol": {
      return wallet.solBalance;
    }
    case "usdcSol": {
      return wallet.usdcSolBalance;
    }
    case "usdtSol": {
      return wallet.usdtSolBalance;
    }
    case "eurcSol": {
      return wallet.eurcSolBalance;
    }
    case "usdySol": {
      return wallet.usdySolBalance;
    }
    default: {
      console.error(`No coin balance found for ${coinId}`);
      return 0;
    }
  }
};

export const calculateExchangeRate = ({
  wallet,
  buyCoinId,
  sellCoinId,
}: {
  wallet: UserWalletDataState;
  buyCoinId: CoinId | null;
  sellCoinId: CoinId | null;
}) => {
  if (!buyCoinId || !sellCoinId) return null;

  const coinUsdPrices = [
    {
      coinId: "btcSol",
      usdPrice: wallet.priceOfBTCinUSDC,
    },
    {
      coinId: "sol",
      usdPrice: wallet.priceOfSOLinUSDC,
    },
    {
      coinId: "usdtSol",
      usdPrice: 1,
    },
    {
      coinId: "usdcSol",
      usdPrice: 1,
    },
    {
      coinId: "usdySol",
      usdPrice: wallet.priceOfUSDYinUSDC,
    },
    {
      coinId: "eurcSol",
      usdPrice: wallet.priceOfEURCinUSDC,
    },
  ];

  const buyPrice = coinUsdPrices.find(
    (val) => val.coinId === buyCoinId
  )?.usdPrice;
  const sellPrice = coinUsdPrices.find(
    (val) => val.coinId === sellCoinId
  )?.usdPrice;

  if (!buyPrice || !sellPrice)
    throw Error(
      `Error retreiving buy/sell prices for ${buyCoinId} buy coin and ${sellCoinId} sell coin`
    );

  return sellPrice / buyPrice;
};
