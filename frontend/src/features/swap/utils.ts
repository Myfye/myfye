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
    return getFormattedNumberFromString(formattedAmount.slice(0, -1));
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
  if (input === "0" && formattedAmount.includes("."))
    return updatedAmount + input;
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
  coinId: CoinId,
  wallet: UserWalletDataState,
  amount: number
) => {
  switch (coinId) {
    case "BTC": {
      return amount * wallet.priceOfBTCinUSDC;
    }
    case "SOL": {
      return amount * 100;
    }
    case "USDT": {
      return amount;
    }
    case "EURC": {
      return amount * wallet.priceOfEURCinUSDC;
    }
    case "USDY": {
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
  switch (coinId) {
    case "BTC": {
      return wallet.btcSolBalance;
    }
    case "SOL": {
      return wallet.solBalance;
    }
    case "USDT": {
      return wallet.usdtSolBalance;
    }
    case "EURC": {
      return wallet.eurcSolBalance;
    }
    case "USDY": {
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
      coinId: "BTC",
      usdPrice: wallet.priceOfBTCinUSDC,
    },
    {
      coinId: "SOL",
      usdPrice: 100,
    },
    {
      coinId: "USDT",
      usdPrice: 1,
    },
    {
      coinId: "USDY",
      usdPrice: wallet.priceOfUSDYinUSDC,
    },
    {
      coinId: "EURC",
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
