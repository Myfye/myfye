import { CashId } from "./cash/types";
import { CryptoId } from "./crypto/types";
import { EarnId } from "./earn/types";
import { StocksId } from "./stocks/types";

export type FiatCurrency = "usd" | "eur";

export interface Asset {
  id: string;
  label: string;
  symbol: string;
  fiatCurrency: FiatCurrency;
  type: "usd" | "stock" | "euro" | "treasury" | "crypto";
  groupId: AssetGroup["id"];
  balance: number;
  exchangeRateUSD: number;
  icon: string | null;
  overlay: {
    isOpen: boolean;
  };
  additionalData?: {
    breakdown?: any;
  };
}

export interface AssetsState {
  assetIds: string[];
  groupIds: AssetGroup["id"][];
  assets: {
    [key: string]: Asset;
  };
  groups: {
    [key in AssetGroup["id"]]: AssetGroup;
  };
}

export interface AssetGroup {
  id: CashId | CryptoId | StocksId | EarnId;
  label: string;
  percentChange: number;
  overlay: {
    isOpen: boolean;
  };
}
