import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay } from "./swapSlice";
import { swap } from "./solana-swap/SwapService";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useId } from "react";
import { Asset } from "../assets/types";
import { getUsdAmount } from "./utils";
import { useAppSelector } from "@/redux/hooks";
import SwapTransactionConfirmationScreen from "@/shared/components/ui/transaction/confirmation/SwapTransactionConfirmationScreen";
import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";

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
    const buyAssetId = transaction.buy.assetId;
    const sellAssetId = transaction.sell.assetId;

    if (!transaction.sell.amount) {
      throw new Error(`Sell amount is null`);
    }
    if (!sellAssetId) {
      throw new Error(`Sell assetId is null`);
    }
    if (!buyAssetId) {
      throw new Error(`Buy assetId is null`);
    }

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

    /*
    dispatch(
      toggleOverlay({
        type: "confirmSwap",
        isOpen: false,
      })
    );
    */
    dispatch(
      toggleOverlay({
        type: "processingTransaction",
        isOpen: true,
      })
    );
  };

  const headingId = useId();
  const sellAsset = useAppSelector((state) =>
    transaction.sell.assetId
      ? state.assets.assets[transaction.sell.assetId]
      : null
  );
  console.log("sellAsset", sellAsset);
  const buyAsset = useAppSelector((state) =>
    transaction.buy.assetId
      ? state.assets.assets[transaction.buy.assetId]
      : null
  );
  console.log("buyAsset", buyAsset);

  const sellAmountUSD = getUsdAmount(
    transaction.sell.assetId,
    assets,
    transaction.sell.amount
  );
  const buyAmountUSD = getUsdAmount(
    transaction.buy.assetId,
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
            icon: sellAsset?.icon.content,
            leftContent: {
              title: "Sell",
              subtitle: sellAsset?.symbol,
            },
            rightContent: {
              title:
                transaction.sell.amount + " " + sellAsset?.symbol,
              subtitle: formatAmountWithCurrency(sellAmountUSD),
              textAlign: "end",
            },
          }}
          output={{
            icon: buyAsset?.icon.content,
            leftContent: {
              title: "Buy",
              subtitle: buyAsset?.symbol,
            },
            rightContent: {
              title: transaction.buy.amount + " " + buyAsset?.symbol,
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
