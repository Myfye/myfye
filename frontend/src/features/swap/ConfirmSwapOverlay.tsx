import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay } from "./swapSlice";
import { swap } from "./solana-swap/SwapService";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useId } from "react";
import { AbstractedAsset } from "../assets/types";
import { getUsdAmount } from "./utils";
import { useAppSelector } from "@/redux/hooks";
import SwapTransactionConfirmationScreen from "@/shared/components/ui/transaction/confirmation/SwapTransactionConfirmationScreen";
import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";

const getAssetId = (abstractedAssetId: AbstractedAsset["id"] | null) => {
  switch (abstractedAssetId) {
    case "us_dollar_yield": {
      return "usdy_sol";
    }
    case "us_dollar": {
      return "usdc_sol";
    }
    case "sol": {
      return "sol";
    }
    case "btc": {
      return "btc_sol";
    }
    case "euro": {
      return "eurc_sol";
    }
    case "xrp": {
      return "xrp_sol";
    }
    case "doge": {
      return "doge_sol";
    }
    case "sui": {
      return "sui_sol";
    }
    case "AAPL": {
      return "AAPL";
    }
    case "MSFT": {
      return "MSFT";
    }
    case "AMZN": {
      return "AMZN";
    }
    case "GOOGL": {
      return "GOOGL";
    }
    case "NVDA": {
      return "NVDA";
    }
    case "TSLA": {
      return "TSLA";
    }
    case "NFLX": {
      return "NFLX";
    }
    case "KO": {
      return "KO";
    }
    case "WMT": {
      return "WMT";
    }
    case "JPM": {
      return "JPM";
    }
    case "SPY": {
      return "SPY";
    }
    case "LLY": {
      return "LLY";
    }
    case "AVGO": {
      return "AVGO";
    }
    case "JNJ": {
      return "JNJ";
    }
    case "V": {
      return "V";
    }
    case "UNH": {
      return "UNH";
    }
    case "XOM": {
      return "XOM";
    }
    case "MA": {
      return "MA";
    }
    case "PG": {
      return "PG";
    }
    case "HD": {
      return "HD";
    }
    case "CVX": {
      return "CVX";
    }
    case "MRK": {
      return "MRK";
    }
    case "PFE": {
      return "PFE";
    }
    case "ABT": {
      return "ABT";
    }
    case "ABBV": {
      return "ABBV";
    }
    case "ACN": {
      return "ACN";
    }
    case "AZN": {
      return "AZN";
    }
    case "BAC": {
      return "BAC";
    }
    case "BRK.B": {
      return "BRK.B";
    }
    case "CSCO": {
      return "CSCO";
    }
    case "COIN": {
      return "COIN";
    }
    case "CMCSA": {
      return "CMCSA";
    }
    case "CRWD": {
      return "CRWD";
    }
    case "DHR": {
      return "DHR";
    }
    case "GS": {
      return "GS";
    }
    case "HON": {
      return "HON";
    }
    case "IBM": {
      return "IBM";
    }
    case "INTC": {
      return "INTC";
    }
    case "LIN": {
      return "LIN";
    }
    case "MRVL": {
      return "MRVL";
    }
    case "MCD": {
      return "MCD";
    }
    case "MDT": {
      return "MDT";
    }
    case "NDAQ": {
      return "NDAQ";
    }
    case "NVO": {
      return "NVO";
    }
    case "ORCL": {
      return "ORCL";
    }
    case "PLTR": {
      return "PLTR";
    }
    case "PM": {
      return "PM";
    }
    case "HOOD": {
      return "HOOD";
    }
    case "CRM": {
      return "CRM";
    }
    case "TMO": {
      return "TMO";
    }
    case "MSTR": {
      return "MSTR";
    }
    case "GME": {
      return "GME";
    }
    default: {
      console.log("abstractedAssetId", abstractedAssetId);
      throw new Error("Could not find abstracted Asset Id");
    }
  }
};

const ConfirmSwapOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useAppSelector(
    (state) => state.swap.overlays.confirmSwap.isOpen
  );
  const transaction = useAppSelector(
    (state: RootState) => state.swap.transaction
  );
  const assets = useAppSelector((state: RootState) => state.assets);
  const walletData = useAppSelector((state: RootState) => state.userWalletData);
  const {
    wallets: [wallet],
  } = useSolanaWallets();

  const handleSwapConfirmation = () => {
    const buyAssetId = getAssetId(transaction.buy.abstractedAssetId);
    const sellAssetId = getAssetId(transaction.sell.abstractedAssetId);

    if (!transaction.sell.amount) {
      throw new Error(`Sell amount is null`);
    }
    if (!transaction.sell.abstractedAssetId) {
      throw new Error(`Sell abstractedAssetId is null`);
    }
    if (!transaction.buy.abstractedAssetId) {
      throw new Error(`Buy abstractedAssetId is null`);
    }

    // TODO update this to a service file
    swap({
      wallet,
      assets,
      publicKey: walletData.solanaPubKey,
      inputAmount: transaction.sell.amount,
      inputCurrency: sellAssetId,
      outputCurrency: buyAssetId,
      dispatch,
      transaction,
    });

    dispatch(
      toggleOverlay({
        type: "processingTransaction",
        isOpen: true,
      })
    );
  };

  const headingId = useId();
  const sellAbstractedAsset = useAppSelector((state) =>
    transaction.sell.abstractedAssetId
      ? state.assets.abstractedAssets[transaction.sell.abstractedAssetId]
      : null
  );
  const buyAbstractedAsset = useAppSelector((state) =>
    transaction.buy.abstractedAssetId
      ? state.assets.abstractedAssets[transaction.buy.abstractedAssetId]
      : null
  );

  const sellAmountUSD = getUsdAmount(
    transaction.sell.abstractedAssetId,
    assets,
    transaction.sell.amount
  );
  const buyAmountUSD = getUsdAmount(
    transaction.buy.abstractedAssetId,
    assets,
    transaction.buy.amount
  );

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "confirmSwap", isOpen }));
        }}
        zIndex={zIndex}
        title="Preview swap"
      >
        <SwapTransactionConfirmationScreen
          input={{
            icon: sellAbstractedAsset?.icon.content,
            leftContent: {
              title: "Sell",
              subtitle: sellAbstractedAsset?.symbol,
            },
            rightContent: {
              title:
                transaction.sell.amount + " " + sellAbstractedAsset?.symbol,
              subtitle: formatAmountWithCurrency(sellAmountUSD),
              textAlign: "end",
            },
          }}
          output={{
            icon: buyAbstractedAsset?.icon.content,
            leftContent: {
              title: "Buy",
              subtitle: buyAbstractedAsset?.symbol,
            },
            rightContent: {
              title: transaction.buy.amount + " " + buyAbstractedAsset?.symbol,
              subtitle: formatAmountWithCurrency(buyAmountUSD),
              textAlign: "end",
            },
          }}
          onConfirm={handleSwapConfirmation}
          onCancel={() => {
            dispatch(toggleOverlay({ type: "confirmSwap", isOpen: false }));
          }}
          headingId={headingId}
          title="Confirm Swap"
          total={(transaction.sell.amount ?? 0) + (transaction.fee ?? 0)}
        />
      </Overlay>
    </>
  );
};

export default ConfirmSwapOverlay;
