export type FiatCurrency = "usd" | "eur";
export type DashboardId = "cash" | "crypto" | "stocks";
export type GroupId = "cash" | "crypto" | "stocks" | "earn";
export type AssetId = "";

export interface Asset {
  id: string;
  label: string;
  symbol: string;
  mintAddress: string;
  tokenProgram: string;
  decimals: number;
  fiatCurrency: FiatCurrency;
  color: string;
  dashboardId: "cash" | "stocks" | "crypto";
  groupId: AssetGroup["id"] | AssetGroup["id"][];
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
  groupIds: AssetGroup["id"][];
  assets: {
    [key: string]: Asset;
  };
  groups: {
    [key in AssetGroup["id"]]: AssetGroup;
  };
}

export interface AssetGroup {
  id: "cash" | "crypto" | "stocks" | "earn" | "retirement";
  label: string;
  percentChange: number;
  overlay?: {
    isOpen: boolean;
  };
}
