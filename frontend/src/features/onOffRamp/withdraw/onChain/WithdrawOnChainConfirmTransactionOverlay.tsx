import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useDispatch } from "react-redux";
import { useId } from "react";
import TransactionConfirmationScreen from "@/shared/components/ui/transaction/confirmation/TransactionConfirmationScreen";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleOverlay, unmountOverlays, updateTransactionStatus } from "./withdrawOnChainSlice";
import { selectAsset } from "@/features/assets/assetsSlice";
import { toggleModal } from "../withdrawSlice";
import { truncateSolanaAddress } from "@/shared/utils/solanaUtils";
import toast from "react-hot-toast/headless";
import { useSolanaWallets } from "@privy-io/react-auth/solana";

const WithdrawOnChainConfirmOverlay = () => {
  const dispatch = useAppDispatch();
  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];

  const isOpen = useAppSelector(
    (state) => state.withdrawOnChain.overlays.confirmTransaction.isOpen
  );

  const transaction = useAppSelector(
    (state) => state.withdrawOnChain.transaction
  );
  const asset = useAppSelector((state) =>
    transaction.assetId ? selectAsset(state, transaction.assetId) : null
  );
  const solanaPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );

  const headingId = useId();

  const handleConfirm = async () => {
    try {
      // Close confirm overlay and open processing overlay
      dispatch(toggleOverlay({ type: "confirmTransaction", isOpen: false }));
      dispatch(toggleOverlay({ type: "processingTransaction", isOpen: true }));
      
      // Update transaction status to idle (processing)
      dispatch(updateTransactionStatus("idle"));
      
      // Import tokenTransfer function
      const { tokenTransfer } = await import("@/functions/Transaction");
      
      if (!transaction.amount) throw new Error("Amount is required");
      if (!transaction.assetId) throw new Error("Token is required");
      if (!transaction.solAddress) throw new Error("Sol address is required");
      if (!wallet) throw new Error("Wallet is required");
      if (!solanaPubKey) throw new Error("Solana public key is required");

      let assetCode = "";
      if (transaction.assetId === "usdc_sol") {
        assetCode = "usdcSol";
      } else if (transaction.assetId === "eurc_sol") {
        assetCode = "eurcSol";
      }

      const sendAmount = +transaction.amount;
      const sendAmountMicro = sendAmount * 1000000;

      const result = await tokenTransfer(
        solanaPubKey,
        transaction.solAddress,
        sendAmountMicro,
        assetCode,
        wallet
      );

      if (result.success) {
        console.log("Transaction successful:", result.transactionId);
        dispatch(updateTransactionStatus("success"));
        toast.success(
          `Sent ${transaction.formattedAmount} ${asset?.symbol} to ${truncateSolanaAddress(
            transaction.solAddress
          )}`
        );
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      dispatch(updateTransactionStatus("fail"));
      toast.error(
        error instanceof Error
          ? error.message
          : "Error sending money. Please try again"
      );
    }
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
            label: transaction.solAddress,
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
