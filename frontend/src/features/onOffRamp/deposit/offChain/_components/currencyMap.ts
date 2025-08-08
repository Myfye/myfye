import { US as USFlag } from "country-flag-icons/react/3x2";
import { MX as MXFlag } from "country-flag-icons/react/3x2";
import { BR as BRFlag } from "country-flag-icons/react/3x2";
import { Currency, CurrencyType } from "../depositOffChain.types";

export interface CurrencyMap {
  ids: CurrencyType[];
  currencies: Record<CurrencyType, Currency>;
}

export const currencyMap: CurrencyMap = {
  ids: [/* "usd",*/ "mxn", "brl"],
  currencies: {
    // usd: {
    //   id: "usd",
    //   value: "usd",
    //   symbol: "USD",
    //   label: "US Dollar",
    //   icon: USFlag,
    // },
    mxn: {
      id: "mxn",
      value: "mxn",
      label: "Mexican Peso",
      symbol: "MXN",

      icon: MXFlag,
    },
    brl: {
      id: "brl",
      value: "brl",
      label: "Brazilian Real",
      symbol: "BRL",
      icon: BRFlag,
    },
  },
};

export const currencyArr = currencyMap.ids.map(
  (id) => currencyMap.currencies[id]
);

export const currencyArrNoIcons = currencyMap.ids.map((id) => {
  const obj = currencyMap.currencies[id];
  const { icon, ...restObj } = obj;
  return restObj;
});
