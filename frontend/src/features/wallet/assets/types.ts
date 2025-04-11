import { CashId } from "./cash/types";
import { CryptoId } from "./crypto/types";
import { EarnId } from "./earn/types";
import { StocksId } from "./stocks/types";

export type FiatCurrency = "usd" | "eur";

export type DashboardId = "cash" | "crypto" | "stocks";

export type GroupId = "cash" | "crypto" | "stocks" | "earn";

export interface AbstractedAsset {
  id: string;
  label: string;
  assetIds: string[];
  symbol: string;
  dashboardId: DashboardId;
  fiatCurrency: FiatCurrency;
  groupId: GroupId;
  color: string;
  icon:
    | {
        content: string;
        type: "image" | "svg";
      }
    | {
        content: string;
        type: "text";
        color: string;
        backgroundColor: string;
      };
  overlay: {
    isOpen: boolean;
  };
}

export interface Asset {
  id: string;
  label: string;
  symbol: string;
  abstractedAssetId: string;
  fiatCurrency: FiatCurrency;
  dashboardId: "cash" | "stocks" | "crypto";
  groupId: AssetGroup["id"];
  balance: number;
  exchangeRateUSD: number;
  icon:
    | {
        content: string;
        type: "image" | "svg";
      }
    | {
        content: string;
        type: "text";
        color: string;
        backgroundColor: string;
      };
  overlay: {
    isOpen: boolean;
  };
  additionalData?: {
    breakdown?: any;
  };
}

export interface AssetsState {
  assetIds: string[];
  dashboardIds: DashboardId[];
  abstractedAssetIds: AbstractedAsset["id"][];
  groupIds: AssetGroup["id"][];
  assets: {
    [key: string]: Asset;
  };
  groups: {
    [key in AssetGroup["id"]]: AssetGroup;
  };
  abstractedAssets: {
    [key in AbstractedAsset["id"]]: AbstractedAsset;
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
