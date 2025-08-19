import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useId } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleOverlay, updateTransactionStatus } from "./withdrawOnChainSlice";
import { selectAsset, updateBalance } from "@/features/assets/assetsSlice";
import { truncateSolanaAddress } from "@/shared/utils/solanaUtils";
import toast from "react-hot-toast/headless";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { tokenTransfer } from "@/functions/Transaction";
import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import TransactionConfirmationScreen from "@/shared/components/ui/transaction/confirmation/TransactionConfirmationScreen";
import { saveSolAddress } from "@/functions/RecentSolAddress";

const WithdrawOnChainPreviewTransactionOverlay = () => {
  const dispatch = useAppDispatch();
  const {
    wallets: [wallet],
  } = useSolanaWallets();

  const isOpen = useAppSelector(
    (state) => state.withdrawOnChain.overlays.confirmTransaction.isOpen
  );
  const user_id = useAppSelector(
    (state) => state.userWalletData.currentUserID
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
    if (!transaction.amount) throw new Error("Amount is required");
    if (!transaction.assetId) throw new Error("Token is required");
    if (!transaction.solAddress) throw new Error("Sol address is required");
    if (!wallet) throw new Error("Wallet is required");
    if (!solanaPubKey) throw new Error("Solana public key is required");

    try {
      // Close confirm overlay and open processing overlay
      dispatch((dispatch, getState) => {
        dispatch(
          toggleOverlay({ type: "processingTransaction", isOpen: true })
        );
        getState();
        dispatch(updateTransactionStatus("idle"));
        dispatch(toggleOverlay({ type: "confirmTransaction", isOpen: false }));
      });

      // Update transaction status to idle (processing)

      const sendAmountMicro = transaction.amount * 1000000;

      const result = await tokenTransfer(
        solanaPubKey,
        transaction.solAddress,
        sendAmountMicro,
        transaction.assetId,
        wallet
      );

      if (result.success) {
        console.log("Transaction successful:", result.transactionId);
        dispatch(updateTransactionStatus("success"));
        toast.success(
          `Sent ${formatAmountWithCurrency(
            transaction.amount,
            asset?.fiatCurrency
          )} ${asset?.symbol} to ${truncateSolanaAddress(
            transaction.solAddress
          )}`
        );

        // Update the asset balance after successful transaction
        const currentBalance = asset.balance;
        const newBalance = currentBalance - transaction.amount;
        dispatch(updateBalance({ 
          assetId: transaction.assetId, 
          balance: newBalance 
        }));
        
        // Save the recently used Solana address
        try {
          console.log("Saving recently used Solana address:", {
            user_id,
            solanaPubKey,
            address: transaction.solAddress
          });
          await saveSolAddress(user_id, transaction.solAddress);
          console.log("Successfully saved recently used Solana address");
        } catch (error) {
          console.error("Failed to save recently used Solana address:", error);
        }
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      dispatch(updateTransactionStatus("fail"));
      toast.error("Error sending money. Please try again");
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
        title="Preview withdraw"
      >
        <TransactionConfirmationScreen
          inputIcon={asset?.icon.content}
          outputIcon="wallet"
          onConfirm={handleConfirm}
          onCancel={() => {
            dispatch(
              toggleOverlay({ type: "confirmTransaction", isOpen: false })
            );
          }}
          headingId={headingId}
          title={`Withdraw ${transaction.amount} ${asset?.symbol}`}
          subtitle={`To ${truncateSolanaAddress(transaction.solAddress ?? "")}`}
        />
      </Overlay>
    </>
  );
};

export default WithdrawOnChainPreviewTransactionOverlay;
