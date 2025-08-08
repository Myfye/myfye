import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useId } from "react";
import TransactionConfirmationScreen from "@/shared/components/ui/transaction/confirmation/TransactionConfirmationScreen";
import { useAppSelector } from "@/redux/hooks";
import { toggleOverlay } from "./withdrawOnChainSlice";
import { selectAsset } from "@/features/assets/assetsSlice";

const WithdrawOnChainConfirmOverlay = () => {
  const dispatch = useDispatch();

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
            label: transaction.solAddress ?? "0xf7938fkjk20138138",
          }}
          onConfirm={() => {}}
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
