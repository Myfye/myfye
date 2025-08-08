import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useDispatch } from "react-redux";
import { useId } from "react";
import TransactionConfirmationScreen from "@/shared/components/ui/transaction/confirmation/TransactionConfirmationScreen";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleOverlay, unmountOverlays } from "./withdrawOnChainSlice";
import { selectAsset } from "@/features/assets/assetsSlice";
import { toggleModal } from "../withdrawSlice";
import { totalmem } from "os";
import { truncateSolanaAddress } from "@/shared/utils/solanaUtils";
import toast from "react-hot-toast/headless";

const WithdrawOnChainConfirmOverlay = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state.withdrawOnChain.overlays.confirmTransaction.isOpen
  );

  const transaction = useAppSelector(
    (state) => state.withdrawOnChain.transaction
  );
  const asset = useAppSelector((state) =>
    transaction.assetId ? selectAsset(state, transaction.assetId) : null
  );

  const headingId = useId();

  const handleConfirm = () => {
    // do transaction
    toast.success(
      `Transferred ${transaction.formattedAmount} ${
        asset?.symbol
      } to ${truncateSolanaAddress(transaction.solAddress ?? "0x38232288")}`
    );
    dispatch(toggleModal(false));
    dispatch(unmountOverlays());
  };

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "confirmTransaction", isOpen }));
        }}
        zIndex={2003}
        aria-labelledby={headingId}
      >
        <TransactionConfirmationScreen
          input={{
            amount: transaction.amount ?? 0,
            icon: asset?.icon.content,
            label: asset?.label ?? "",
            tokenSymbol: asset?.symbol ?? "",
            fiatCurrency: "usd",
          }}
          output={{
            icon: "wallet",
            label: transaction.solAddress ?? "0x832838232889",
          }}
          onConfirm={handleConfirm}
          onCancel={() => {
            dispatch(
              toggleOverlay({ type: "confirmTransaction", isOpen: false })
            );
          }}
          headingId={headingId}
          title="Confirm withdrawal"
        />
      </Overlay>
    </>
  );
};

export default WithdrawOnChainConfirmOverlay;
