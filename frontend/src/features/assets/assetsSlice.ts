import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { Asset, AssetGroup, AssetsState } from "./types";
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
    "BTC",
    "SOL",
    "XRP",
    "DOGE",
    "SUI",
    // Cash
    "USD",
    "EUR",
    // Earn
    "USDY",
  ],
  groupIds: ["stocks", "earn", "cash", "crypto"],
  dashboardIds: ["stocks", "cash", "crypto"],
  assets: {
    // Stocks
    AAPL: {
      id: "AAPL",
      label: "Apple, Inc.",
      symbol: "AAPL",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
      fiatCurrency: "usd",
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
    "AMZN": {
      id: "AMZN",
      label: "Amazon.com Inc.",
      symbol: "AMZN",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "GOOGL": {
      id: "GOOGL",
      label: "Alphabet Inc.",
      symbol: "GOOGL",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    NVDA: {
      id: "NVDA",
      label: "NVIDIA Corporation",
      symbol: "NVDA",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
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
    TSLA: {
      id: "TSLA",
      label: "Tesla, Inc.",
      symbol: "TSLA",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    SPY: {
      id: "SPY",
      label: "S&P 500 ETF",
      symbol: "SPY",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "MSFT": {
      id: "MSFT",
      label: "Microsoft Corporation",
      symbol: "MSFT",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
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
    "NFLX": {
      id: "NFLX",
      label: "Netflix, Inc.",
      symbol: "NFLX",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsEH7wWfJJu2ZT3UCFeVfALnVA6CP5ur7Ee11KmzVpL",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "KO": {
      id: "KO",
      label: "Coca-Cola Company",
      symbol: "KO",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsaBXg8dU5cPM6ehmVctMkVqoiRG2ZjMo1cyBJ3AykQ",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "WMT": {
      id: "WMT",
      label: "Walmart Inc.",
      symbol: "WMT",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "JPM": {
      id: "JPM",
      label: "JPMorgan Chase & Co.",
      symbol: "JPM",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsMAqkcKsUewDrzVkait4e5u4y8REgtyS7jWgCpLV2C",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "LLY": {
      id: "LLY",
      label: "Eli Lilly and Company",
      symbol: "LLY",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xsnuv4omNoHozR6EEW5mXkw8Nrny5rB3jVfLqi6gKMH",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "AVGO": {
      id: "AVGO",
      label: "Broadcom Inc.",
      symbol: "AVGO",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsgSaSvNSqLTtFuyWPBhK9196Xb9Bbdyjj4fH3cPJGo",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "JNJ": {
      id: "JNJ",
      label: "Johnson & Johnson",
      symbol: "JNJ",
      mintAddress: "XsGVi5eo1Dh2zUpic4qACcjuWGjNv8GCt3dm5XcX6Dn",
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
    "V": {
      id: "V",
      label: "Visa Inc.",
      symbol: "V",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "UNH": {
      id: "UNH",
      label: "UnitedHealth Group Incorporated",
      symbol: "UNH",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "XOM": {
      id: "XOM",
      label: "Exxon Mobil Corporation",
      symbol: "XOM",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsaHND8sHyfMfsWPj6kSdd5VwvCayZvjYgKmmcNL5qh",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "MA": {
      id: "MA",
      label: "Mastercard Incorporated",
      symbol: "MA",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsApJFV9MAktqnAc6jqzsHVujxkGm9xcSUffaBoYLKC",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "PG": {
      id: "PG",
      label: "The Procter & Gamble Company",
      symbol: "PG",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "HD": {
      id: "HD",
      label: "The Home Depot, Inc.",
      symbol: "HD",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XszjVtyhowGjSC5odCqBpW1CtXXwXjYokymrk7fGKD3",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "CVX": {
      id: "CVX",
      label: "Chevron Corporation",
      symbol: "CVX",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsNNMt7WTNA2sV3jrb1NNfNgapxRF5i4i6GcnTRRHts",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "MRK": {
      id: "MRK",
      label: "Merck & Co., Inc.",
      symbol: "MRK",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsnQnU7AdbRZYe2akqqpibDdXjkieGFfSkbkjX1Sd1X",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "PFE": {
      id: "PFE",
      label: "Pfizer Inc.",
      symbol: "PFE",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsAtbqkAP1HJxy7hFDeq7ok6yM43DQ9mQ1Rh861X8rw",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "ABT": {
      id: "ABT",
      label: "Abbott Laboratories",
      symbol: "ABT",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsHtf5RpxsQ7jeJ9ivNewouZKJHbPxhPoEy6yYvULr7",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "ABBV": {
      id: "ABBV",
      label: "AbbVie Inc.",
      symbol: "ABBV",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XswbinNKyPmzTa5CskMbCPvMW6G5CMnZXZEeQSSQoie",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "ACN": {
      id: "ACN",
      label: "Accenture plc",
      symbol: "ACN",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs5UJzmCRQ8DWZjskExdSQDnbE6iLkRu2jjrRAB1JSU",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "AZN": {
      id: "AZN",
      label: "AstraZeneca PLC",
      symbol: "AZN",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs3ZFkPYT2BN7qBMqf1j1bfTeTm1rFzEFSsQ1z3wAKU",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "BAC": {
      id: "BAC",
      label: "Bank of America Corporation",
      symbol: "BAC",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XswsQk4duEQmCbGzfqUUWYmi7pV7xpJ9eEmLHXCaEQP",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "BRK.B": {
      id: "BRK.B",
      label: "Berkshire Hathaway Inc.",
      symbol: "BRK.B",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs6B6zawENwAbWVi7w92rjazLuAr5Az59qgWKcNb45x",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "CSCO": {
      id: "CSCO",
      label: "Cisco Systems, Inc.",
      symbol: "CSCO",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xsr3pdLQyXvDJBFgpR5nexCEZwXvigb8wbPYp4YoNFf",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    COIN: {
      id: "COIN",
      label: "Coinbase Global, Inc.",
      symbol: "COIN",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "CMCSA": {
      id: "CMCSA",
      label: "Comcast Corporation",
      symbol: "CMCSA",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsvKCaNsxg2GN8jjUmq71qukMJr7Q1c5R2Mk9P8kcS8",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "CRWD": {
      id: "CRWD",
      label: "CrowdStrike Holdings, Inc.",
      symbol: "CRWD",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs7xXqkcK7K8urEqGg52SECi79dRp2cEKKuYjUePYDw",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "DHR": {
      id: "DHR",
      label: "Danaher Corporation",
      symbol: "DHR",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xseo8tgCZfkHxWS9xbFYeKFyMSbWEvZGFV1Gh53GtCV",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "GS": {
      id: "GS",
      label: "The Goldman Sachs Group, Inc.",
      symbol: "GS",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsgaUyp4jd1fNBCxgtTKkW64xnnhQcvgaxzsbAq5ZD1",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "HON": {
      id: "HON",
      label: "Honeywell International Inc.",
      symbol: "HON",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsRbLZthfABAPAfumWNEJhPyiKDW6TvDVeAeW7oKqA2",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "IBM": {
      id: "IBM",
      label: "International Business Machines Corporation",
      symbol: "IBM",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XspwhyYPdWVM8XBHZnpS9hgyag9MKjLRyE3tVfmCbSr",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "INTC": {
      id: "INTC",
      label: "Intel Corporation",
      symbol: "INTC",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XshPgPdXFRWB8tP1j82rebb2Q9rPgGX37RuqzohmArM",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "LIN": {
      id: "LIN",
      label: "Linde plc",
      symbol: "LIN",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsSr8anD1hkvNMu8XQiVcmiaTP7XGvYu7Q58LdmtE8Z",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "MRVL": {
      id: "MRVL",
      label: "Marvell Technology, Inc.",
      symbol: "MRVL",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsuxRGDzbLjnJ72v74b7p9VY6N66uYgTCyfwwRjVCJA",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "MCD": {
      id: "MCD",
      label: "McDonald's Corporation",
      symbol: "MCD",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "MDT": {
      id: "MDT",
      label: "Medtronic plc",
      symbol: "MDT",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsDgw22qRLTv5Uwuzn6T63cW69exG41T6gwQhEK22u2",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "NDAQ": {
      id: "NDAQ",
      label: "Nasdaq, Inc.",
      symbol: "NDAQ",
      mintAddress: "XsnQnU7AdbRZYe2akqqpibDdXjkieGFfSkbkjX1Sd1X",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "NVO": {
      id: "NVO",
      label: "Novo Nordisk A/S",
      symbol: "NVO",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsfAzPzYrYjd4Dpa9BU3cusBsvWfVB9gBcyGC87S57n",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "ORCL": {
      id: "ORCL",
      label: "Oracle Corporation",
      symbol: "ORCL",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsjFwUPiLofddX5cWFHW35GCbXcSu1BCUGfxoQAQjeL",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "PLTR": {
      id: "PLTR",
      label: "Palantir Technologies Inc.",
      symbol: "PLTR",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsoBhf2ufR8fTyNSjqfU71DYGaE6Z3SUGAidpzriAA4",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "PM": {
      id: "PM",
      label: "Philip Morris International Inc.",
      symbol: "PM",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xsba6tUnSjDae2VcopDB6FGGDaxRrewFCDa5hKn5vT3",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "HOOD": {
      id: "HOOD",
      label: "Robinhood Markets, Inc.",
      symbol: "HOOD",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "CRM": {
      id: "CRM",
      label: "Salesforce, Inc.",
      symbol: "CRM",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsczbcQ3zfcgAEt9qHQES8pxKAVG5rujPSHQEXi4kaN",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "TMO": {
      id: "TMO",
      label: "Thermo Fisher Scientific Inc.",
      symbol: "TMO",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xs8drBWy3Sd5QY3aifG9kt9KFs2K3PGZmx7jWrsrk57",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "MSTR": {
      id: "MSTR",
      label: "MicroStrategy, Inc.",
      symbol: "MSTR",
      color: "var(--clr-surface-lowered)",
      mintAddress: "XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    "GME": {
      id: "GME",
      label: "GameStop Corp. Class A, Inc.",
      symbol: "GME",
      color: "var(--clr-surface-lowered)",
      mintAddress: "Xsf9mBktVB9BSU5kf4nHxPq5hCBJ2j2ui3ecFGxPRGc",
      tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
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
    // Crypto
    BTC: {
      id: "BTC",
      label: "Bitcoin",
      symbol: "BTC",
      color: "orange",
      mintAddress: "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
    SOL: {
      id: "SOL",
      label: "Solana",
      symbol: "SOL",
      color: "var(--clr-purple-400)",
      mintAddress: "So11111111111111111111111111111111111111112",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
    XRP: {
      id: "XRP",
      label: "Ripple",
      symbol: "XRP",
      color: "var(--clr-surface-lowered)",
      mintAddress: "2jcHBYd9T2Mc9nhvFEBCDuBN1XjbbQUVow67WGWhv6zT",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
    DOGE: {
      id: "DOGE",
      label: "Dogecoin",
      symbol: "DOGE",
      color: "var(--clr-surface-lowered)",
      mintAddress: "BFARNBVWNfZfh3JQJLhogQJ9bkop4Y8LaDHeSxDDk5nn",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
    SUI: {
      id: "SUI",
      label: "Sui",
      symbol: "SUI",
      color: "var(--clr-surface-lowered)",
      mintAddress: "756wWVqA9tpZpxqNxCiJYSCGWi3gD2NXfwKHh4YsYJg9",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
    USD: {
      id: "USD",
      label: "US Dollar",
      symbol: "USD",
      color: "var(--clr-green-400)",
      mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 1,
      icon: {
        content: usDollarIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    EUR: {
      id: "EUR",
      label: "Euro",
      symbol: "EUR",
      color: "var(--clr-blue-400)",
      mintAddress: "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      dashboardId: "cash",
      fiatCurrency: "eur",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: euroIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    // Earn
    USDY: {
      id: "USDY",
      label: "US Dollar Yield",
      symbol: "USDY",
      color: "var(--clr-purple-400)",
      mintAddress: "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6",
      tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
};

/*
export const selectAsset = (state: RootState, asset: string) =>
  state.assets.assets[asset];
*/
export const selectAssetId = (_: RootState, assetId: Asset["id"]) => assetId;
export const selectAsset = (
  state: RootState,
  assetId: Asset["id"]
) => state.assets.assets[assetId];
export const selectAssets = (state: RootState) => state.assets;
export const selectAssetGroupId = (_: RootState, groupId: AssetGroup["id"]) =>
  groupId;
export const selectAssetDashboardId = (
  _: RootState,
  dashboardId: Asset["dashboardId"]
) => dashboardId;
/*
export const selectAssetId = (
  _: RootState,
  assetId: Asset["assetId"]
) => assetId;
 */

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
/*
export const selectAssetsBalanceUSD = createSelector(
  [selectAssets],
  (assets) => {
    // find assets
    const assetsArr = assets.assetIds.map((id) => {
      return assets.assets[id];
    });
    const balanceArr = assetsArr.map((asset) => {
      // get assets
      const mappedAssets = asset.assetIds.map(
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
*/

/*
export const selectAssetsWithBalance = createSelector(
  [selectAssets],
  (assets) => {
    // find assets
    const assetsArr = assets.assetIds.map((id) => {
      return assets.assets[id];
    });
    return assetsArr.map((asset) => {
      // get assets
      const filteredAssets = asset.assetIds.map(
        (id) => assets.assets[id]
      );
      const balance = filteredAssets.reduce((acc, val) => acc + val.balance, 0);
      let balanceUSD = filteredAssets.reduce(
        (acc, val) => acc + val.balance * val.exchangeRateUSD,
        0
      );
      balanceUSD = Math.floor(balanceUSD * 100) / 100;
      return { ...asset, balance, balanceUSD };
    });
  }
);
*/


export const selectAssetsWithBalance = createSelector(
  [selectAssets],
  (assets) => {
    // find assets
    const assetsArr = assets.assetIds.map((id) => {
      return assets.assets[id];
    });
    return assetsArr.map((asset) => {
      // Each asset has its own balance and exchange rate
      const balance = asset.balance || 0;
      let balanceUSD = balance * (asset.exchangeRateUSD || 0);
      balanceUSD = Math.floor(balanceUSD * 100) / 100;
      return { ...asset, balance, balanceUSD };
    });
  }
);

export const selectAssetWithBalance = createSelector(
  [selectAssetsWithBalance, selectAssetId],
  (assetsWithBalance, assetId) => {
    // find assets
    const [result] = assetsWithBalance.filter(
      (asset) => asset.id === assetId
    );
    return result;
  }
);

/*
export const selectAssetBalanceUSD = createSelector(
  [selectAssets, selectAssetId],
  (assets, assetId) => {
    // find assets
    const asset = assets.assets[assetId];
    // get assets
    const mappedAssets = asset.assetIds.map(
      (id) => assets.assets[id]
    );

    const balance = mappedAssets.reduce(
      (acc, val) => acc + val.balance * val.exchangeRateUSD,
      0
    );
    return Math.floor(balance * 100) / 100;
  }
);
*/

export const selectAssetBalanceUSD = createSelector(
  [selectAsset],
  (asset) => {
    if (!asset) {
      console.error(`selectAssetBalanceUSD - ERROR: assetId ${assetId} is not found in assets.assets`);
    }
    return Math.floor(asset.balance * asset.exchangeRateUSD * 100) / 100;
  }
);

export const selectAssetsWithBalanceByGroup = createSelector(
  [selectAssetsWithBalance, selectAssetGroupId],
  (assetsWithBalance, groupId) => {
    // find assets
    return assetsWithBalance.filter(
      (asset) => asset.groupId === groupId
    );
  }
);

export const selectAssetsWithBalanceByDashboard = createSelector(
  [selectAssetsWithBalance, selectAssetDashboardId],
  (assetsWithBalance, dashboardId) => {
    // find assets
    return assetsWithBalance.filter(
      (asset) => asset.dashboardId === dashboardId
    );
  }
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

// New selector to get asset ID from mint address
export const selectAssetIdFromMintAddress = createSelector(
  [selectAssets],
  (assets) => (mintAddress: string) => {
    const asset = Object.values(assets.assets).find(
      (asset) => asset.mintAddress === mintAddress
    );
    return asset ? asset.id : null;
  }
);

// New selector to get asset ticker/symbol from mint address
export const selectAssetTickerFromMintAddress = createSelector(
  [selectAssets],
  (assets) => (mintAddress: string) => {
    const asset = Object.values(assets.assets).find(
      (asset) => asset.mintAddress === mintAddress
    );
    return asset ? asset.symbol : null;
  }
);

// New selector to get mint address from asset ID
export const selectMintAddress = createSelector(
  [selectAssets],
  (assets) => (assetId: string) => {
    const asset = assets.assets[assetId];
    return asset ? asset.mintAddress : null;
  }
);

// Simple utility function to get mint address from asset ID (doesn't require Redux state)
export const getMintAddress = (assetId: string): string | null => {
  const asset = initialState.assets[assetId];
  if (!asset) {
    console.error(`getMintAddress - ERROR: assetId ${assetId} is not found in initialState.assets`);
    console.error(`getMintAddress - Available assets:`, Object.keys(initialState.assets));
  }
  return asset ? asset.mintAddress : null;
};

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
