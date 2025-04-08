import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { Asset, AssetGroup, AssetsState } from "./types";
import { RootState } from "@/redux/store";
import { getAssetsBalanceUSDByGroup, getAssetsByGroup } from "./utils";

import btcCoinIcon from "@/assets/svgs/coins/btc-coin.svg";
import solCoinIcon from "@/assets/svgs/coins/sol-coin.svg";
import usdCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";
import microsoftCoinIcon from "@/assets/svgs/coins/microsoft.svg";
import appleCoinIcon from "@/assets/svgs/coins/apple.svg";
import googleCoinIcon from "@/assets/svgs/coins/google.png";

const initialState: AssetsState = {
  assetIds: [
    // Stocks
    "APPL.d_base",
    "MSFT.d_base",
    "GOOGL.d_base",
    "NFLX.d_base",
    "AMZN.d_base",
    "SQ.d_base",
    "DIS.d_base",
    "TSLA.d_base",
    "AMD.d_base",
    "SPY.d_base",
    "MSTR.d_base",
    "IAU.d_base",
    "KO.d_base",
    "AMC.d_base",
    "GME.d_base",
    // Cash
    "usdt_sol",
    "usdc_sol",
    "usdc_base",
    "eurc_sol",
    // Earn
    "usdy_sol",
  ],
  groupIds: ["stocks", "earn", "cash", "crypto"],
  assets: {
    // Stocks
    "APPL.d_base": {
      id: "APPL.d_base",
      label: "Apple, Inc.",
      symbol: "APPL",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "MSFT.d_base": {
      id: "MSFT.d_base",
      label: "Microsoft Corporation",
      symbol: "MSFT",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "GOOGL.d_base": {
      id: "GOOGL.d_base",
      label: "Alphabet, inc.",
      symbol: "GOOGL",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "NFLX.d_base": {
      id: "NFLX.d_base",
      label: "Netflix, Inc.",
      symbol: "NFLX",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "AMZN.d_base": {
      id: "AMZN.d_base",
      label: "Amazon.com, Inc.",
      symbol: "AMZN",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "SQ.d_base": {
      id: "SQ.d_base",
      label: "Block, Inc.",
      symbol: "SQ",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "DIS.d_base": {
      id: "DIS.d_base",
      label: "Walt Disney Company",
      symbol: "DIS",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "TSLA.d_base": {
      id: "TSLA.d_base",
      label: "Tesla, Inc.",
      symbol: "TSLA",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "AMD.d_base": {
      id: "AMD.d_base",
      label: "Advanced Micro Devices",
      symbol: "AMD",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "SPY.d_base": {
      id: "SPY.d_base",
      label: "SPDR S&P 500 ETF Trust",
      symbol: "SPY",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "MSTR.d_base": {
      id: "MSTR.d_base",
      label: "MicroStrategy, Inc.",
      symbol: "MSTR",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "IAU.d_base": {
      id: "IAU.d_base",
      label: "iShares Gold Trust",
      symbol: "IAU",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "KO.d_base": {
      id: "KO.d_base",
      label: "Coca-Cola Company",
      symbol: "KO",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "AMC.d_base": {
      id: "AMC.d_base",
      label: "AMC Entertainment Holdings, Inc.",
      symbol: "AMC",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    "GME.d_base": {
      id: "GME.d_base",
      label: "GameStop Corp. Class A, Inc.",
      symbol: "GME",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: null,
      overlay: {
        isOpen: false,
      },
    },
    // Crypto
    btc_sol: {
      id: "btc_sol",
      label: "Bitcoin",
      symbol: "CBBTC",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: btcCoinIcon,
      overlay: {
        isOpen: false,
      },
    },
    sol: {
      id: "sol",
      label: "Solana",
      symbol: "SOL",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: solCoinIcon,
      overlay: {
        isOpen: false,
      },
    },
    // Cash
    usdt_sol: {
      id: "usdt_sol",
      label: "US Dollar",
      symbol: "USDT",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: usdCoinIcon,
      overlay: {
        isOpen: false,
      },
    },
    usdc_sol: {
      id: "usdc_sol",
      label: "US Dollar",
      symbol: "USDC",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: usdCoinIcon,
      overlay: {
        isOpen: false,
      },
    },
    usdc_base: {
      id: "usdc_base",
      label: "US Dollar",
      symbol: "USDC",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: usdCoinIcon,
      overlay: {
        isOpen: false,
      },
    },
    eurc_sol: {
      id: "eurc_sol",
      label: "Euro",
      symbol: "EUR",
      fiatCurrency: "eur",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: euroCoinIcon,
      overlay: {
        isOpen: false,
      },
    },
    // Earn
    usdy_sol: {
      id: "usdy_sol",
      label: "US Dollar Yield",
      symbol: "usdy",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: usdyCoinIcon,
      overlay: {
        isOpen: false,
      },
    },
  },
  groups: {
    stocks: {
      id: "stocks",
      label: "Stocks",
      percentChange: 0,
      overlay: { isOpen: false },
    },
    cash: {
      id: "cash",
      label: "Cash",
      percentChange: 0,
      overlay: { isOpen: false },
    },
    crypto: {
      id: "earn",
      label: "Earn",
      percentChange: 0,
      overlay: { isOpen: false },
    },
    earn: {
      id: "earn",
      label: "Earn",
      percentChange: 0,
      overlay: { isOpen: false },
    },
  },
};

export const selectAssets = (state: RootState) => state.assets;
export const selectAssetGroupId = (_: RootState, groupId: AssetGroup["id"]) =>
  groupId;
export const selectAsset = (state: RootState, asset: string) =>
  state.assets.assets[asset];

export const selectAssetsArray = createSelector([selectAssets], (assets) =>
  assets.assetIds.map((assetId) => assets.assets[assetId])
);

export const selectAssetsGroupsArray = createSelector(
  [selectAssets],
  (assets) => assets.groupIds.map((groupId) => assets.groups[groupId])
);

export const selectAssetsByGroup = createSelector(
  [selectAssets, selectAssetGroupId],
  (assets, groupId) => getAssetsByGroup(assets, groupId)
);

export const selectAssetsBalanceUSDByGroup = createSelector(
  [selectAssets, selectAssetGroupId],
  (assets, groupId) => getAssetsBalanceUSDByGroup(assets, groupId)
);

export const selectAssetBalanceUSD = createSelector(
  [selectAsset],
  (asset) => asset.balance * asset.exchangeRateUSD
);

export const selectAssetsBalanceUSD = createSelector(
  [selectAssets],
  (assets) => {
    const allAssets = assets.assetIds.map((assetId) => assets.assets[assetId]);
    return allAssets.reduce(
      (acc, val) => acc + val.balance * val.exchangeRateUSD,
      0
    );
  }
);

export const assetsSlice = createSlice({
  name: "assets",
  initialState: initialState,
  reducers: {
    toggleAssetOverlay: (
      state,
      action: PayloadAction<{ assetId: Asset["id"]; isOpen: boolean }>
    ) => {
      state.assets[action.payload.assetId].overlay.isOpen =
        action.payload.isOpen;
    },
    toggleGroupOverlay: (
      state,
      action: PayloadAction<{ groupId: AssetGroup["id"]; isOpen: boolean }>
    ) => {
      state.groups[action.payload.groupId].overlay.isOpen =
        action.payload.isOpen;
    },
    updateBalance: (
      state,
      action: PayloadAction<{ assetId: Asset["id"]; balance: number }>
    ) => {
      state.assets[action.payload.assetId].balance = action.payload.balance;
    },
    updateExchangeRateUSD: (
      state,
      action: PayloadAction<{ assetId: Asset["id"]; exchangeRateUSD: number }>
    ) => {
      state.assets[action.payload.assetId].exchangeRateUSD =
        action.payload.exchangeRateUSD;
    },
  },
});

export const {
  toggleAssetOverlay,
  toggleGroupOverlay,
  updateBalance,
  updateExchangeRateUSD,
} = assetsSlice.actions;

export default assetsSlice.reducer;
