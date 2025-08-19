import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleOverlay, unmountOverlays, unmount } from "./withdrawOnChainSlice";
import { toggleModal } from "../withdrawSlice";
import TransactionProcessScreen from "@/shared/components/ui/processing-transaction-screen/TransactionProcessScreen";
import { TransactionStatus } from "@/shared/components/ui/processing-transaction-screen/TransactionProcessStatus";
import { selectAsset } from "@/features/assets/assetsSlice";

const getTitle = (
  status: TransactionStatus,
  amount: number,
  symbol: string
) => {
  switch (status) {
    case "success": {
      return `Sent ${amount} ${symbol}`;
    }
    case "fail": {
      return `Error processing transaction.`;
    }
    default: {
      return `Sending ${amount} ${symbol}...`;
    }
  }
};

const getSubtitle = (status: TransactionStatus, address: string) => {
  switch (status) {
    case "fail": {
      return `Please try again.`;
    }
    default: {
      return `To ${address}`;
    }
  }
};

const WithdrawProcessingTransactionOverlay = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.withdrawOnChain.overlays.processingTransaction.isOpen
  );
  const transaction = useAppSelector(
    (state) => state.withdrawOnChain.transaction
  );

  const asset = useAppSelector((state) =>
    transaction.assetId ? selectAsset(state, transaction.assetId) : null
  );

  const title = getTitle(transaction.status, transaction.amount, asset?.symbol);
  const subtitle = getSubtitle(
    transaction.status,
    transaction.solAddress ?? ""
  );

  return (
    <HeadlessOverlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        dispatch(toggleOverlay({ type: "processingTransaction", isOpen }));
      }}
      zIndex={2004}
    >
      <TransactionProcessScreen
        status={transaction.status}
        title={title}
        subtitle={subtitle}
        onClose={() => {
          // Close the main withdraw modal
          dispatch(toggleModal(false));
          // Close all other overlays and reset state
          dispatch(unmountOverlays());
          dispatch(unmount());
        }}
      />
    </HeadlessOverlay>
  );
};

export default WithdrawProcessingTransactionOverlay;
