import { CashId } from "./cash/type";
import { CryptoId } from "./crypto/type";
import { EarnId } from "./earn/type";
import { StocksId } from "./stocks/type";

export type FiatCurrency = "usd" | "eur";

export interface Asset {
  id: string;
  label: string;
  symbol: string;
  fiatCurrency: FiatCurrency;
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
