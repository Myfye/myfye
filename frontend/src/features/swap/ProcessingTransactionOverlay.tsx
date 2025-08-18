import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleOverlay, unmount } from "./swapSlice";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useState } from "react";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";
import { useLottie } from "lottie-react";
import { SwapTransactionStatus } from "./types";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import { useAppSelector } from "@/redux/hooks";
import TransactionProcessScreen from "@/shared/components/ui/processing-transaction-screen/TransactionProcessScreen";
import { TransactionStatus } from "@/shared/components/ui/processing-transaction-screen/TransactionProcessStatus";
import { selectAsset } from "../assets/assetsSlice";

const getTitle = (status: TransactionStatus) => {
  switch (status) {
    case "success": {
      return "Swap complete!";
    }
    case "fail": {
      return "Swap error";
    }
    default: {
      return "Swapping...";
    }
  }
};

const getSubtitle = (
  assetId: string,
  assetSymbol: string,
  amount: number,
  status: TransactionStatus
) => {
  switch (status) {
    case "success": {
      return `${amount} ${assetSymbol} has been deposited into your wallet.`;
    }
    case "fail": {
      // Check if the selling asset is SOL or WSOL
      const isSellingSolana =
        assetId === "sol" || assetId === "w_sol";

      return isSellingSolana
        ? "Error processing swap. Try selling less Solana to pay for the blockchain fee."
        : "Error processing swap. Please try again.";
    }
    default: {
      return `${assetSymbol} will be deposited into your wallet once the transaction is complete.`;
    }
  }
};

const ProcessingTransactionOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useAppSelector(
    (state) => state.swap.overlays.processingTransaction.isOpen
  );
  const transaction = useAppSelector((state) => state.swap.transaction);

  const asset = useAppSelector((state) =>
    transaction.buy.assetId
      ? selectAsset(state, transaction.buy.assetId)
      : null
  );

  const title = getTitle(transaction.status);
  const subtitle = getSubtitle(
    transaction.buy.assetId,
    asset?.symbol,
    transaction.buy.amount,
    transaction.status
  );

  return (
    <HeadlessOverlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        toggleOverlay({ type: "processingTransaction", isOpen });
      }}
      zIndex={4000}
    >
      <TransactionProcessScreen
        title={title}
        subtitle={subtitle}
        status={transaction.status}
        onClose={() => {
          dispatch(unmount());
        }}
      />
    </HeadlessOverlay>
  );
};

export default ProcessingTransactionOverlay;
