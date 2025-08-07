import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { AbstractedAsset, Asset, AssetGroup, AssetsState } from "./types";
import { RootState } from "@/redux/store";
import { getAssetsBalanceUSDByGroup, getAssetsByGroup } from "./utils";

import btcIcon from "@/assets/icons/assets/crypto/Bitcoin.svg";
import solIcon from "@/assets/icons/assets/crypto/Solana.svg";
import usDollarIcon from "@/assets/icons/assets/cash/US Dollar.svg";
import euroIcon from "@/assets/icons/assets/cash/Euro.svg";
import usDollarYieldIcon from "@/assets/icons/assets/earn/US Dollar Yield.svg";
import xrpIcon from "@/assets/icons/assets/crypto/Ripple.svg";
import dogeIcon from "@/assets/icons/assets/crypto/Dogecoin.svg";
import suiIcon from "@/assets/icons/assets/crypto/Sui.svg";
import usdcIcon from "@/assets/icons/assets/crypto/USDC.svg";
import eurcIcon from "@/assets/icons/assets/crypto/EURC.svg";

// List of stock icons
import AbbottIcon from "@/assets/icons/assets/stocks/Abbott.svg";
import AbbVieIcon from "@/assets/icons/assets/stocks/AbbVie.svg";
import AccentureIcon from "@/assets/icons/assets/stocks/Accenture.svg";
import AppLovinIcon from "@/assets/icons/assets/stocks/AppLovin.svg";
import AstraZenecaIcon from "@/assets/icons/assets/stocks/AstraZeneca.svg";
import BankOfAmericaIcon from "@/assets/icons/assets/stocks/Bank of America.svg";
import BerkshireHathawayIcon from "@/assets/icons/assets/stocks/BerkshireHathaway.svg";
import BroadcomIcon from "@/assets/icons/assets/stocks/Broadcom Inc.svg";
import ChaseIcon from "@/assets/icons/assets/stocks/Chase.svg";
import ChevronIcon from "@/assets/icons/assets/stocks/Chevron.svg";
import Circle from "@/assets/icons/assets/stocks/Circle.svg";
import CiscoIcon from "@/assets/icons/assets/stocks/cisco.svg";
import CoinbaseIcon from "@/assets/icons/assets/stocks/COIN.png";
import ComcastIcon from "@/assets/icons/assets/stocks/Comcast.svg";
import CorwdStrikeIcon from "@/assets/icons/assets/stocks/CrowdStrike.svg";
import DanaherIcon from "@/assets/icons/assets/stocks/Danaher.png"; // PNG
import EliLillyIcon from "@/assets/icons/assets/stocks/Eli Lilly.svg";
import ExxonMobilIcon from "@/assets/icons/assets/stocks/ExxonMobil.png"; // PNG
import GoldmanSachsIcon from "@/assets/icons/assets/stocks/Goldman Sachs.svg";
import HoneywellIcon from "@/assets/icons/assets/stocks/Honeywell.svg";
import IBMIcon from "@/assets/icons/assets/stocks/IBM.svg";
import IntelIcon from "@/assets/icons/assets/stocks/Intel.svg";
import JohnsonJohnsonIcon from "@/assets/icons/assets/stocks/Johnson & Johnson.svg";
import LindeIcon from "@/assets/icons/assets/stocks/linde.svg";
import MarvellIcon from "@/assets/icons/assets/stocks/Marvell Technology.svg";
import MastercardIcon from "@/assets/icons/assets/stocks/Mastercard.svg";
import McDonaldsIcon from "@/assets/icons/assets/stocks/McDonald's.svg";
import MedtronicIcon from "@/assets/icons/assets/stocks/Medtronic.svg";
import MerckIcon from "@/assets/icons/assets/stocks/Merck.svg";
import MetaIcon from "@/assets/icons/assets/stocks/Meta.svg";
import NasdaqIcon from "@/assets/icons/assets/stocks/Nasdaq.svg";
import NovoNordiskIcon from "@/assets/icons/assets/stocks/Novo Nordisk.svg";
import NvidiaIcon from "@/assets/icons/assets/stocks/NVIDIA.svg";
import OracleIcon from "@/assets/icons/assets/stocks/Oracle.svg";
import PalantirIcon from "@/assets/icons/assets/stocks/Palantir.svg";
import PfizerIcon from "@/assets/icons/assets/stocks/Pfizer.svg";
import PhilipMorrisIcon from "@/assets/icons/assets/stocks/Philip Morris.svg";
import ProcterGambleIcon from "@/assets/icons/assets/stocks/Procter & Gamble.svg";
import RobinhoodIcon from "@/assets/icons/assets/stocks/Robinhood.png"; // PNG
import SalesforceIcon from "@/assets/icons/assets/stocks/Salesforce.svg";
import HomeDepotIcon from "@/assets/icons/assets/stocks/The Home Depot.svg";
import ThermoFisherIcon from "@/assets/icons/assets/stocks/Thermo Fisher Scientific.svg";
import UnitedHealthIcon from "@/assets/icons/assets/stocks/UnitedHealth Group.svg";
import VanguardIcon from "@/assets/icons/assets/stocks/Vanguard.svg";
import VisaIcon from "@/assets/icons/assets/stocks/Visa Inc.svg";
import WalmartIcon from "@/assets/icons/assets/stocks/Walmart.svg";
import XeroxIcon from "@/assets/icons/assets/stocks/Xerox.svg";
import YahooIcon from "@/assets/icons/assets/stocks/Yahoo.svg";
import ZohoIcon from "@/assets/icons/assets/stocks/Zoho.svg";
import ZyngaIcon from "@/assets/icons/assets/stocks/Zynga.svg";
import AAPLIcon from "@/assets/icons/assets/stocks/Apple, Inc..svg";
import MSFTIcon from "@/assets/icons/assets/stocks/Microsoft Corporation.svg";
import GOOGLIcon from "@/assets/icons/assets/stocks/GOOGL.svg";
import NFLXIcon from "@/assets/icons/assets/stocks/Netflix, Inc..svg";
import AMZNIcon from "@/assets/icons/assets/stocks/Amazon.com, Inc..svg";
import TSLAIcon from "@/assets/icons/assets/stocks/Tesla, Inc..svg";
import MSTRIcon from "@/assets/icons/assets/stocks/MicroStrategy, Inc..svg";
import KOIcon from "@/assets/icons/assets/stocks/The Coca-Cola Company.svg";
import GMEIcon from "@/assets/icons/assets/stocks/Gamestop Corp. Class A, Inc..svg";
import SPYIcon from "@/assets/icons/assets/stocks/S&P.png";

//import SQIcon from "@/assets/icons/assets/stocks/Block, Inc..svg";
//import DISIcon from "@/assets/icons/assets/stocks/Walt Disney Company.svg";
//import AMDIcon from "@/assets/icons/assets/stocks/Advanced Micro Devices.svg";
//import AMCIcon from "@/assets/icons/assets/stocks/AMC Entertainment Holdings, Inc..svg";

const initialState: AssetsState = {
  assetIds: [
    //SPY, Tesla, Coin, Hood, and Apple
    // Stocks
    "AAPL_sol",
    //"MSFT_sol",
    //"AMZN_sol",
    //"GOOGL_sol",
    "NVDA_sol",
    "TSLA_sol",
    //"NFLX_sol",
    //"KO_sol",
    //"WMT_sol",
    //"JPM_sol",
    "SPY_sol",
    //"LLY_sol",
    //"AVGO_sol",
    //"JNJ_sol",
    //"V_sol",
    //"UNH_sol",
    //"XOM_sol",
    //"MA_sol",
    //"PG_sol",
    //"HD_sol",
    //"CVX_sol",
    //"MRK_sol",
    //"PFE_sol",
    //"ABT_sol",
    //"ABBV_sol",
    //"ACN_sol",
    //"AZN_sol",
    //"BAC_sol",
    //"BRK.B_sol",
    //"CSCO_sol",
    "COIN_sol",
    //"CMCSA_sol",
    //"CRWD_sol",
    //"DHR_sol",
    //"GS_sol",
    //"HON_sol",
    //"IBM_sol",
    //"INTC_sol",
    //"LIN_sol",
    //"MRVL_sol",
    //"MCD_sol",
    //"MDT_sol",
    //"NDAQ_sol",
    //"NVO_sol",
    //"ORCL_sol",
    //"PLTR_sol",
    //"PM_sol",
    //"HOOD_sol",
    //"CRM_sol",
    //"TMO_sol",
    //"MSTR_sol",
    //"GME_sol",
    // Crypto
    "btc_sol",
    "sol",
    "xrp_sol",
    "doge_sol",
    "sui_sol",
    // Cash
    "usdt_sol",
    "usdc_sol",
    "usdc_base",
    "eurc_sol",
    // Earn
    "usdy_sol",
  ],
  abstractedAssetIds: [
    // Stocks
    "AAPL",
    //"MSFT",
    //"AMZN",
    //"GOOGL",
    "NVDA",
    "TSLA",
    //"NFLX",
    //"KO",
    //"WMT",
    //"JPM",
    "SPY",
    //"LLY",
    //"AVGO",
    //"JNJ",
    //"V",
    //"UNH",
    //"XOM",
    //"MA",
    //"PG",
    //"HD",
    //"CVX",
    //"MRK",
    //"PFE",
    //"ABT",
    //"ABBV",
    //"ACN",
    //"AZN",
    //"BAC",
    //"BRK.B",
    //"CSCO",
    "COIN",
    //"CMCSA",
    //"CRWD",
    //"DHR",
    //"GS",
    //"HON",
    //"IBM",
    //"INTC",
    //"LIN",
    //"MRVL",
    //"MCD",
    //"MDT",
    //"NDAQ",
    //"NVO",
    //"ORCL",
    //"PLTR",
    //"PM",
    //"HOOD",
    //"CRM",
    //"TMO",
    //"MSTR",
    //"GME",
    // Crypto
    "btc",
    "sol",
    "xrp",
    "doge",
    "sui",
    // Cash
    "us_dollar",
    "euro",
    // Earn
    "us_dollar_yield",
  ],
  groupIds: ["stocks", "earn", "cash", "crypto"],
  dashboardIds: ["stocks", "cash", "crypto"],
  assets: {
    // Stocks
    AAPL_sol: {
      id: "AAPL_sol",
      label: "Apple, Inc.",
      symbol: "AAPL",
      fiatCurrency: "usd",
      abstractedAssetId: "AAPL",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AAPLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    /*
    "AMZN_sol": {
      id: "AMZN_sol",
      label: "Amazon.com Inc.",
      symbol: "AMZN",
      abstractedAssetId: "AMZN",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AMZNIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "GOOGL_sol": {
      id: "GOOGL_sol",
      label: "Alphabet Inc.",
      symbol: "GOOGL",
      abstractedAssetId: "GOOGL",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: GOOGLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    NVDA_sol: {
      id: "NVDA_sol",
      label: "NVIDIA Corporation",
      symbol: "NVDA",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      abstractedAssetId: "NVDA",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: NvidiaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    TSLA_sol: {
      id: "TSLA_sol",
      label: "Tesla, Inc.",
      symbol: "TSLA",
      abstractedAssetId: "TSLA",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: TSLAIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    SPY_sol: {
      id: "SPY_sol",
      label: "S&P 500 ETF",
      symbol: "SPY",
      abstractedAssetId: "SPY",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: SPYIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    /*
    "MSFT_sol": {
      id: "MSFT_sol",
      label: "Microsoft Corporation",
      symbol: "MSFT",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      abstractedAssetId: "MSFT",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MSFTIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    /*
    "NFLX_sol": {
      id: "NFLX_sol",
      label: "Netflix, Inc.",
      symbol: "NFLX",
      abstractedAssetId: "NFLX",
      fiatCurrency: "usd",
      groupId: "stocks",

      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: NFLXIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "KO_sol": {
      id: "KO_sol",
      label: "Coca-Cola Company",
      symbol: "KO",
      abstractedAssetId: "KO",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: KOIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "WMT_sol": {
      id: "WMT_sol",
      label: "Walmart Inc.",
      symbol: "WMT",
      abstractedAssetId: "WMT",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: WalmartIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "JPM_sol": {
      id: "JPM_sol",
      label: "JPMorgan Chase & Co.",
      symbol: "JPM",
      abstractedAssetId: "JPM",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: ChaseIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    /*
    "LLY_sol": {
      id: "LLY_sol",
      label: "Eli Lilly and Company",
      symbol: "LLY",
      abstractedAssetId: "LLY",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: EliLillyIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "AVGO_sol": {
      id: "AVGO_sol",
      label: "Broadcom Inc.",
      symbol: "AVGO",
      abstractedAssetId: "AVGO",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: BroadcomIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "JNJ_sol": {
      id: "JNJ_sol",
      label: "Johnson & Johnson",
      symbol: "JNJ",
      abstractedAssetId: "JNJ",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: JohnsonJohnsonIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "V_sol": {
      id: "V_sol",
      label: "Visa Inc.",
      symbol: "V",
      abstractedAssetId: "V",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: VisaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "UNH_sol": {
      id: "UNH_sol",
      label: "UnitedHealth Group Incorporated",
      symbol: "UNH",
      abstractedAssetId: "UNH",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: UnitedHealthIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "XOM_sol": {
      id: "XOM_sol",
      label: "Exxon Mobil Corporation",
      symbol: "XOM",
      abstractedAssetId: "XOM",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: ExxonMobilIcon,
        type: "png",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MA_sol": {
      id: "MA_sol",
      label: "Mastercard Incorporated",
      symbol: "MA",
      abstractedAssetId: "MA",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MastercardIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "PG_sol": {
      id: "PG_sol",
      label: "The Procter & Gamble Company",
      symbol: "PG",
      abstractedAssetId: "PG",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: ProcterGambleIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "HD_sol": {
      id: "HD_sol",
      label: "The Home Depot, Inc.",
      symbol: "HD",
      abstractedAssetId: "HD",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: HomeDepotIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "CVX_sol": {
      id: "CVX_sol",
      label: "Chevron Corporation",
      symbol: "CVX",
      abstractedAssetId: "CVX",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: ChevronIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MRK_sol": {
      id: "MRK_sol",
      label: "Merck & Co., Inc.",
      symbol: "MRK",
      abstractedAssetId: "MRK",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MerckIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "PFE_sol": {
      id: "PFE_sol",
      label: "Pfizer Inc.",
      symbol: "PFE",
      abstractedAssetId: "PFE",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: PfizerIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "ABT_sol": {
      id: "ABT_sol",
      label: "Abbott Laboratories",
      symbol: "ABT",
      abstractedAssetId: "ABT",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AbbottIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "ABBV_sol": {
      id: "ABBV_sol",
      label: "AbbVie Inc.",
      symbol: "ABBV",
      abstractedAssetId: "ABBV",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AbbVieIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "ACN_sol": {
      id: "ACN_sol",
      label: "Accenture plc",
      symbol: "ACN",
      abstractedAssetId: "ACN",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AccentureIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "AZN_sol": {
      id: "AZN_sol",
      label: "AstraZeneca PLC",
      symbol: "AZN",
      abstractedAssetId: "AZN",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AstraZenecaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "BAC_sol": {
      id: "BAC_sol",
      label: "Bank of America Corporation",
      symbol: "BAC",
      abstractedAssetId: "BAC",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: BankOfAmericaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "BRK.B_sol": {
      id: "BRK.B_sol",
      label: "Berkshire Hathaway Inc.",
      symbol: "BRK.B",
      abstractedAssetId: "BRK.B",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: BerkshireHathawayIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "CSCO_sol": {
      id: "CSCO_sol",
      label: "Cisco Systems, Inc.",
      symbol: "CSCO",
      abstractedAssetId: "CSCO",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: CiscoIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    COIN_sol: {
      id: "COIN_sol",
      label: "Coinbase Global, Inc.",
      symbol: "COIN",
      abstractedAssetId: "COIN",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: CoinbaseIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    /*
    "CMCSA_sol": {
      id: "CMCSA_sol",
      label: "Comcast Corporation",
      symbol: "CMCSA",
      abstractedAssetId: "CMCSA",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: ComcastIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "CRWD_sol": {
      id: "CRWD_sol",
      label: "CrowdStrike Holdings, Inc.",
      symbol: "CRWD",
      abstractedAssetId: "CRWD",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: CorwdStrikeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "DHR_sol": {
      id: "DHR_sol",
      label: "Danaher Corporation",
      symbol: "DHR",
      abstractedAssetId: "DHR",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: DanaherIcon,
        type: "png",
      },
      overlay: {
        isOpen: false,
      },
    },
    "GS_sol": {
      id: "GS_sol",
      label: "The Goldman Sachs Group, Inc.",
      symbol: "GS",
      abstractedAssetId: "GS",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: GoldmanSachsIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "HON_sol": {
      id: "HON_sol",
      label: "Honeywell International Inc.",
      symbol: "HON",
      abstractedAssetId: "HON",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: HoneywellIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "IBM_sol": {
      id: "IBM_sol",
      label: "International Business Machines Corporation",
      symbol: "IBM",
      abstractedAssetId: "IBM",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: IBMIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "INTC_sol": {
      id: "INTC_sol",
      label: "Intel Corporation",
      symbol: "INTC",
      abstractedAssetId: "INTC",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: IntelIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "LIN_sol": {
      id: "LIN_sol",
      label: "Linde plc",
      symbol: "LIN",
      abstractedAssetId: "LIN",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: LindeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MRVL_sol": {
      id: "MRVL_sol",
      label: "Marvell Technology, Inc.",
      symbol: "MRVL",
      abstractedAssetId: "MRVL",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MarvellIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MCD_sol": {
      id: "MCD_sol",
      label: "McDonald's Corporation",
      symbol: "MCD",
      abstractedAssetId: "MCD",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: McDonaldsIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MDT_sol": {
      id: "MDT_sol",
      label: "Medtronic plc",
      symbol: "MDT",
      abstractedAssetId: "MDT",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MedtronicIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "NDAQ_sol": {
      id: "NDAQ_sol",
      label: "Nasdaq, Inc.",
      symbol: "NDAQ",
      abstractedAssetId: "NDAQ",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: NasdaqIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "NVO_sol": {
      id: "NVO_sol",
      label: "Novo Nordisk A/S",
      symbol: "NVO",
      abstractedAssetId: "NVO",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: NovoNordiskIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "ORCL_sol": {
      id: "ORCL_sol",
      label: "Oracle Corporation",
      symbol: "ORCL",
      abstractedAssetId: "ORCL",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: OracleIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "PLTR_sol": {
      id: "PLTR_sol",
      label: "Palantir Technologies Inc.",
      symbol: "PLTR",
      abstractedAssetId: "PLTR",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: PalantirIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "PM_sol": {
      id: "PM_sol",
      label: "Philip Morris International Inc.",
      symbol: "PM",
      abstractedAssetId: "PM",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: PhilipMorrisIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "HOOD_sol": {
      id: "HOOD_sol",
      label: "Robinhood Markets, Inc.",
      symbol: "HOOD",
      abstractedAssetId: "HOOD",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: RobinhoodIcon,
        type: "png",
      },
      overlay: {
        isOpen: false,
      },
    },
    "CRM_sol": {
      id: "CRM_sol",
      label: "Salesforce, Inc.",
      symbol: "CRM",
      abstractedAssetId: "CRM",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: SalesforceIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "TMO_sol": {
      id: "TMO_sol",
      label: "Thermo Fisher Scientific Inc.",
      symbol: "TMO",
      abstractedAssetId: "TMO",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: ThermoFisherIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MSTR_sol": {
      id: "MSTR_sol",
      label: "MicroStrategy, Inc.",
      symbol: "MSTR",
      abstractedAssetId: "MSTR",
      fiatCurrency: "usd",

      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MSTRIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "GME_sol": {
      id: "GME_sol",
      label: "GameStop Corp. Class A, Inc.",
      symbol: "GME",
      abstractedAssetId: "GME",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: GMEIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    // Crypto
    btc_sol: {
      id: "btc_sol",
      label: "Bitcoin",
      abstractedAssetId: "btc",
      symbol: "CBBTC",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: btcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sol: {
      id: "sol",
      label: "Solana",
      abstractedAssetId: "sol",
      symbol: "SOL",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: solIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    xrp_sol: {
      id: "xrp_sol",
      label: "Ripple",
      abstractedAssetId: "xrp",
      symbol: "XRP",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: xrpIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    doge_sol: {
      id: "doge_sol",
      label: "Dogecoin",
      abstractedAssetId: "doge",
      symbol: "DOGE",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: dogeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sui_sol: {
      id: "sui_sol",
      label: "Sui",
      abstractedAssetId: "sui",
      symbol: "SUI",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: suiIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },

    // Cash
    usdt_sol: {
      id: "usdt_sol",
      label: "USDT",
      abstractedAssetId: "us_dollar",
      symbol: "USDT",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 1,
      icon: {
        content: usdcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    usdc_sol: {
      id: "usdc_sol",
      label: "USDC",
      abstractedAssetId: "us_dollar",
      symbol: "USDC",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 1,
      icon: {
        content: usdcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    usdc_base: {
      id: "usdc_base",
      label: "US Dollar",
      abstractedAssetId: "us_dollar",
      symbol: "USDC",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 1,
      icon: {
        content: usdcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    eurc_sol: {
      id: "eurc_sol",
      label: "EURC",
      abstractedAssetId: "euro",
      symbol: "EURC",
      dashboardId: "cash",
      fiatCurrency: "eur",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: eurcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    // Earn
    usdy_sol: {
      id: "usdy_sol",
      label: "US Dollar Yield",
      abstractedAssetId: "us_dollar_yield",
      symbol: "USDY",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "earn",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: usDollarYieldIcon,
        type: "svg",
      },
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
      id: "crypto",
      label: "Crypto",
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
  abstractedAssets: {
    // Stocks
    AAPL: {
      id: "AAPL",
      assetIds: ["AAPL_sol"],
      label: "Apple, Inc.",
      symbol: "AAPL",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      icon: {
        content: AAPLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    /*
    MSFT: {
      id: "MSFT",
      assetIds: ["MSFT_sol"],
      label: "Microsoft Corporation",
      symbol: "MSFT",
      color: "var(--clr-surface-lowered)",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      icon: {
        content: MSFTIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    /*
    AMZN: {
      id: "AMZN",
      assetIds: ["AMZN_sol"],
      label: "Amazon.com, Inc.",
      symbol: "AMZN",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",

      dashboardId: "stocks",
      groupId: "stocks",
      icon: {
        content: AMZNIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    GOOGL: {
      id: "GOOGL",
      assetIds: ["GOOGL_sol"],
      label: "Alphabet, inc.",
      symbol: "GOOGL",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: GOOGLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    NVDA: {
      id: "NVDA",
      assetIds: ["NVDA_sol"],
      label: "NVIDIA Corporation",
      symbol: "NVDA",
      color: "var(--clr-surface-lowered)",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      icon: {
        content: NvidiaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    TSLA: {
      id: "TSLA",
      assetIds: ["TSLA_sol"],
      label: "Tesla, Inc.",
      symbol: "TSLA",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",
      groupId: "stocks",
      icon: {
        content: TSLAIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    /*
    NFLX: {
      id: "NFLX",
      assetIds: ["NFLX_sol"],
      label: "Netflix, Inc.",
      symbol: "NFLX",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: NFLXIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    KO: {
      id: "KO",
      assetIds: ["KO_sol"],
      label: "Coca-Cola Company",
      symbol: "KO",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: KOIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    JPM: {
      id: "JPM",
      assetIds: ["JPM_sol"],
      label: "JPMorgan Chase & Co.",
      symbol: "JPM",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: ChaseIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    WMT: {
      id: "WMT",
      assetIds: ["WMT_sol"],
      label: "Walmart Inc.",
      symbol: "WMT",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: WalmartIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    SPY: {
      id: "SPY",
      assetIds: ["SPY_sol"],
      label: "S&P 500",
      symbol: "SPY",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: SPYIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    /*
    LLY: {
      id: "LLY",
      assetIds: ["LLY_sol"],
      label: "Eli Lilly and Company",
      symbol: "LLY",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: EliLillyIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    AVGO: {
      id: "AVGO",
      assetIds: ["AVGO_sol"],
      label: "Broadcom Inc.",
      symbol: "AVGO",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: BroadcomIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    JNJ: {
      id: "JNJ",
      assetIds: ["JNJ_sol"],
      label: "Johnson & Johnson",
      symbol: "JNJ",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: JohnsonJohnsonIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    V: {
      id: "V",
      assetIds: ["V_sol"],
      label: "Visa Inc.",
      symbol: "V",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: VisaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    UNH: {
      id: "UNH",
      assetIds: ["UNH_sol"],
      label: "UnitedHealth Group Incorporated",
      symbol: "UNH",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: UnitedHealthIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    XOM: {
      id: "XOM",
      assetIds: ["XOM_sol"],
      label: "Exxon Mobil Corporation",
      symbol: "XOM",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: ExxonMobilIcon,
        type: "png",
      },
      overlay: {
        isOpen: false,
      },
    },
    MA: {
      id: "MA",
      assetIds: ["MA_sol"],
      label: "Mastercard Incorporated",
      symbol: "MA",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: MastercardIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    PG: {
      id: "PG",
      assetIds: ["PG_sol"],
      label: "The Procter & Gamble Company",
      symbol: "PG",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: ProcterGambleIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    HD: {
      id: "HD",
      assetIds: ["HD_sol"],
      label: "The Home Depot, Inc.",
      symbol: "HD",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: HomeDepotIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    CVX: {
      id: "CVX",
      assetIds: ["CVX_sol"],
      label: "Chevron Corporation",
      symbol: "CVX",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: ChevronIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    MRK: {
      id: "MRK",
      assetIds: ["MRK_sol"],
      label: "Merck & Co., Inc.",
      symbol: "MRK",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: MerckIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    PFE: {
      id: "PFE",
      assetIds: ["PFE_sol"],
      label: "Pfizer Inc.",
      symbol: "PFE",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: PfizerIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    ABT: {
      id: "ABT",
      assetIds: ["ABT_sol"],
      label: "Abbott Laboratories",
      symbol: "ABT",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: AbbottIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    ABBV: {
      id: "ABBV",
      assetIds: ["ABBV_sol"],
      label: "AbbVie Inc.",
      symbol: "ABBV",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: AbbVieIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    ACN: {
      id: "ACN",
      assetIds: ["ACN_sol"],
      label: "Accenture plc",
      symbol: "ACN",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: AccentureIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    AZN: {
      id: "AZN",
      assetIds: ["AZN_sol"],
      label: "AstraZeneca PLC",
      symbol: "AZN",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: AstraZenecaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    BAC: {
      id: "BAC",
      assetIds: ["BAC_sol"],
      label: "Bank of America Corporation",
      symbol: "BAC",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: BankOfAmericaIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "BRK.B": {
      id: "BRK.B",
      assetIds: ["BRK.B_sol"],
      label: "Berkshire Hathaway Inc.",
      symbol: "BRK.B",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: BerkshireHathawayIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    CSCO: {
      id: "CSCO",
      assetIds: ["CSCO_sol"],
      label: "Cisco Systems, Inc.",
      symbol: "CSCO",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: CiscoIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    COIN: {
      id: "COIN",
      assetIds: ["COIN_sol"],
      label: "Coinbase Global, Inc.",
      symbol: "COIN",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: CoinbaseIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    /*
    CMCSA: {
      id: "CMCSA",
      assetIds: ["CMCSA_sol"],
      label: "Comcast Corporation",
      symbol: "CMCSA",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: ComcastIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    CRWD: {
      id: "CRWD",
      assetIds: ["CRWD_sol"],
      label: "CrowdStrike Holdings, Inc.",
      symbol: "CRWD",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: CorwdStrikeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    DHR: {
      id: "DHR",
      assetIds: ["DHR_sol"],
      label: "Danaher Corporation",
      symbol: "DHR",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: DanaherIcon,
        type: "png",
      },
      overlay: {
        isOpen: false,
      },
    },
    GS: {
      id: "GS",
      assetIds: ["GS_sol"],
      label: "The Goldman Sachs Group, Inc.",
      symbol: "GS",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: GoldmanSachsIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    HON: {
      id: "HON",
      assetIds: ["HON_sol"],
      label: "Honeywell International Inc.",
      symbol: "HON",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: HoneywellIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    IBM: {
      id: "IBM",
      assetIds: ["IBM_sol"],
      label: "International Business Machines Corporation",
      symbol: "IBM",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: IBMIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    INTC: {
      id: "INTC",
      assetIds: ["INTC_sol"],
      label: "Intel Corporation",
      symbol: "INTC",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: IntelIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    LIN: {
      id: "LIN",
      assetIds: ["LIN_sol"],
      label: "Linde plc",
      symbol: "LIN",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: LindeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    MRVL: {
      id: "MRVL",
      assetIds: ["MRVL_sol"],
      label: "Marvell Technology, Inc.",
      symbol: "MRVL",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: MarvellIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    MCD: {
      id: "MCD",
      assetIds: ["MCD_sol"],
      label: "McDonald's Corporation",
      symbol: "MCD",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: McDonaldsIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    MDT: {
      id: "MDT",
      assetIds: ["MDT_sol"],
      label: "Medtronic plc",
      symbol: "MDT",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: MedtronicIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    NDAQ: {
      id: "NDAQ",
      assetIds: ["NDAQ_sol"],
      label: "Nasdaq, Inc.",
      symbol: "NDAQ",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: NasdaqIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    NVO: {
      id: "NVO",
      assetIds: ["NVO_sol"],
      label: "Novo Nordisk A/S",
      symbol: "NVO",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: NovoNordiskIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    ORCL: {
      id: "ORCL",
      assetIds: ["ORCL_sol"],
      label: "Oracle Corporation",
      symbol: "ORCL",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: OracleIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    PLTR: {
      id: "PLTR",
      assetIds: ["PLTR_sol"],
      label: "Palantir Technologies Inc.",
      symbol: "PLTR",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: PalantirIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    PM: {
      id: "PM",
      assetIds: ["PM_sol"],
      label: "Philip Morris International Inc.",
      symbol: "PM",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: PhilipMorrisIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    HOOD: {
      id: "HOOD",
      assetIds: ["HOOD_sol"],
      label: "Robinhood Markets, Inc.",
      symbol: "HOOD",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: RobinhoodIcon,
        type: "png",
      },
      overlay: {
        isOpen: false,
      },
    },
    CRM: {
      id: "CRM",
      assetIds: ["CRM_sol"],
      label: "Salesforce, Inc.",
      symbol: "CRM",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: SalesforceIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    TMO: {
      id: "TMO",
      assetIds: ["TMO_sol"],
      label: "Thermo Fisher Scientific Inc.",
      symbol: "TMO",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: ThermoFisherIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },

    MSTR: {
      id: "MSTR",
      assetIds: ["MSTR_sol"],
      label: "MicroStrategy, Inc.",
      symbol: "MSTR",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",

      dashboardId: "stocks",
      groupId: "stocks",
      icon: {
        content: MSTRIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    GME: {
      id: "GME",
      assetIds: ["GME_sol"],
      label: "GameStop Corp. Class A, Inc.",
      symbol: "GME",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: GMEIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    */
    us_dollar: {
      id: "us_dollar",
      label: "US Dollar",
      symbol: "USD",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      color: "var(--clr-green-400)",
      assetIds: ["usdc_sol", "usdt_sol", "usdc_base"],
      icon: {
        content: usDollarIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    us_dollar_yield: {
      id: "us_dollar_yield",
      label: "US Dollar Yield",
      assetIds: ["usdy_sol"],
      symbol: "USD",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "earn",
      color: "var(--clr-purple-400)",
      icon: {
        content: usDollarYieldIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    euro: {
      id: "euro",
      label: "Euro",
      assetIds: ["eurc_sol"],
      symbol: "EUR",
      dashboardId: "cash",
      fiatCurrency: "eur",
      groupId: "cash",
      color: "var(--clr-blue-400)",
      icon: {
        content: euroIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sol: {
      id: "sol",
      label: "Solana",
      assetIds: ["sol"],
      symbol: "SOL",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-purple-400)",
      icon: {
        content: solIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    btc: {
      id: "btc",
      label: "Bitcoin",
      assetIds: ["btc_sol"],
      symbol: "BTC",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "orange",
      icon: {
        content: btcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    xrp: {
      id: "xrp",
      label: "Ripple",
      assetIds: ["xrp_sol"],
      symbol: "XRP",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: xrpIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    doge: {
      id: "doge",
      label: "Dogecoin",
      assetIds: ["doge_sol"],
      symbol: "DOGE",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: dogeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sui: {
      id: "sui",
      label: "Sui",
      assetIds: ["sui_sol"],
      symbol: "SUI",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: suiIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
  },
};

export const selectAsset = (state: RootState, asset: string) =>
  state.assets.assets[asset];
export const selectAssetId = (_: RootState, assetId: Asset["id"]) => assetId;
export const selectAbstractedAsset = (
  state: RootState,
  abstractedAssetId: AbstractedAsset["id"]
) => state.assets.abstractedAssets[abstractedAssetId];
export const selectAssets = (state: RootState) => state.assets;
export const selectAssetGroupId = (_: RootState, groupId: AssetGroup["id"]) =>
  groupId;
export const selectAssetDashboardId = (
  _: RootState,
  dashboardId: Asset["dashboardId"]
) => dashboardId;
export const selectAbstractedAssetId = (
  _: RootState,
  abstractedAssetId: Asset["abstractedAssetId"]
) => abstractedAssetId;

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

export const selectAssetsByDashboardId = createSelector(
  [selectAssets, selectAssetDashboardId],
  (assets, dashboardId) => {
    const assetsArr = assets.assetIds.map((assetId) => assets.assets[assetId]);
    const labelledAssets = assetsArr.filter(
      (asset) => asset.dashboardId === dashboardId
    );
    return labelledAssets;
  }
);
export const selectAssetsBalanceUSDByDashboardId = createSelector(
  [selectAssets, selectAssetDashboardId],
  (assets, dashboardId) => {
    const assetsArr = assets.assetIds.map((assetId) => assets.assets[assetId]);
    const labelledAssets = assetsArr.filter(
      (asset) => asset.dashboardId === dashboardId
    );
    return labelledAssets.reduce(
      (acc, val) => acc + val.balance * val.exchangeRateUSD,
      0
    );
  }
);

export const selectAssetsBalanceUSD = createSelector(
  [selectAssets],
  (assets) => {
    const allAssets = assets.assetIds.map((assetId, index) => {
      const asset = assets.assets[assetId];

      if (!asset) {
        console.error(
          `selectAssetsBalanceUSD - MISSING ASSET: ${assetId} is not found in assets.assets`
        );
        console.error(
          `selectAssetsBalanceUSD - Available assets:`,
          Object.keys(assets.assets)
        );
      }

      return asset;
    });

    const result = allAssets.reduce((acc, val, index) => {
      const assetId = assets.assetIds[index];

      if (!val) {
        return acc;
      }
      if (typeof val.balance === "undefined") {
        console.error(
          `selectAssetsBalanceUSD - ERROR: assetId ${assetId} has undefined balance:`,
          val
        );
        return acc;
      }
      if (typeof val.exchangeRateUSD === "undefined") {
        console.error(
          `selectAssetsBalanceUSD - ERROR: assetId ${assetId} has undefined exchangeRateUSD:`,
          val
        );
        return acc;
      }

      const calculation = val.balance * val.exchangeRateUSD;
      return acc + calculation;
    }, 0);

    return result;
  }
);

export const selectAbstractedAssetsWithBalance = createSelector(
  [selectAssets],
  (assets) => {
    // find assets
    const abstractedAssetsArr = assets.abstractedAssetIds.map((id) => {
      return assets.abstractedAssets[id];
    });
    return abstractedAssetsArr.map((abstractedAsset) => {
      // get assets
      const filteredAssets = abstractedAsset.assetIds.map(
        (id) => assets.assets[id]
      );
      const balance = filteredAssets.reduce((acc, val) => acc + val.balance, 0);
      let balanceUSD = filteredAssets.reduce(
        (acc, val) => acc + val.balance * val.exchangeRateUSD,
        0
      );
      balanceUSD = Math.floor(balanceUSD * 100) / 100;
      return { ...abstractedAsset, balance, balanceUSD };
    });
  }
);

export const selectAbstractedAssetsBalanceUSD = createSelector(
  [selectAssets],
  (assets) => {
    // find assets
    const abstractedAssetsArr = assets.abstractedAssetIds.map((id) => {
      return assets.abstractedAssets[id];
    });
    const balanceArr = abstractedAssetsArr.map((abstractedAsset) => {
      // get assets
      const mappedAssets = abstractedAsset.assetIds.map(
        (id) => assets.assets[id]
      );
      const balance = mappedAssets.reduce(
        (acc, val) => acc + val.balance * val.exchangeRateUSD,
        0
      );
      return Math.floor(balance * 100) / 100;
    });
    return balanceArr.reduce((acc, val) => acc + val, 0);
  }
);

export const selectAbstractedAssetWithBalance = createSelector(
  [selectAbstractedAssetsWithBalance, selectAbstractedAssetId],
  (abstractedAssetsWithBalance, abstractedAssetId) => {
    // find assets
    const [result] = abstractedAssetsWithBalance.filter(
      (asset) => asset.id === abstractedAssetId
    );
    return result;
  }
);

export const selectAbstractedAssetBalanceUSD = createSelector(
  [selectAssets, selectAbstractedAssetId],
  (assets, assetId) => {
    // find assets
    const abstractedAsset = assets.abstractedAssets[assetId];
    // get assets
    const mappedAssets = abstractedAsset.assetIds.map(
      (id) => assets.assets[id]
    );

    const balance = mappedAssets.reduce(
      (acc, val) => acc + val.balance * val.exchangeRateUSD,
      0
    );
    return Math.floor(balance * 100) / 100;
  }
);

export const selectAbstractedAssetsWithBalanceByGroup = createSelector(
  [selectAbstractedAssetsWithBalance, selectAssetGroupId],
  (abstractedAssetsWithBalance, groupId) => {
    // find assets
    return abstractedAssetsWithBalance.filter(
      (asset) => asset.groupId === groupId
    );
  }
);

export const selectAbstractedAssetsWithBalanceByDashboard = createSelector(
  [selectAbstractedAssetsWithBalance, selectAssetDashboardId],
  (abstractedAssetsWithBalance, dashboardId) => {
    // find assets
    return abstractedAssetsWithBalance.filter(
      (asset) => asset.dashboardId === dashboardId
    );
  }
);

export const selectAssetBalanceUSD = createSelector(
  [selectAsset],
  (asset) => Math.floor(asset.balance * asset.exchangeRateUSD * 100) / 100
);

export const selectAssetBalance = createSelector(
  [selectAssetsArray, selectAssetId],
  (assets, assetId) => {
    // find assets
    const result = assets.find((asset) => asset.id === assetId);
    if (!result) throw new Error("Asset not found");
    return result.balance;
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
