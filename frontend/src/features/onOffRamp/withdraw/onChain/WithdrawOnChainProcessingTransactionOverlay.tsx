import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import toast from "react-hot-toast/headless";
import { tokenTransfer } from "@/functions/Transaction";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { truncateSolanaAddress } from "@/shared/utils/solanaUtils";
import Button from "@/shared/components/ui/button/Button";

interface WithdrawProcessingTransactionOverlayProps extends OverlayProps {
  status: "idle" | "success" | "fail";
}

const WithdrawProcessingTransactionOverlay = ({
  isOpen,
  onOpenChange,
}: WithdrawProcessingTransactionOverlayProps) => {
  const transaction = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction
  );
  const userId = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );
  const solanaPubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );
  const assets = useSelector((state: RootState) => state.assets.assets);
  const handleConfirm = async () => {
    try {
      if (!transaction.amount) throw new Error("Amount is required");
      if (!userId) throw new Error("User ID is required");
      if (!transaction.assetId) throw new Error("Token is required");
      if (!transaction.solAddress) throw new Error("Sol address is required");

      let assetCode = "";
      if (transaction.assetId === "usdc_sol") {
        assetCode = "usdcSol";
      } else if (transaction.assetId === "eurc_sol") {
        assetCode = "eurcSol";
      }

      const tokenLabel = assets[transaction.assetId].label;
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
        toast.success(
          `Sent ${transaction.amount} ${tokenLabel} to ${truncateSolanaAddress(
            transaction.solAddress
          )}`
        );

        // Here if the address is not in the recent addresses, save the address to the database
        if (!recentAddresses?.addresses.includes(address)) {
          await handleSaveAddress();
        }
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error sending money. Please try again"
      );
    }
  };
  return (
    <HeadlessOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100svh;
        `}
      >
        <section>
          <div
            css={css`
              width: 12rem;
              aspect-ratio: 1;
              margin-inline: auto;
            `}
          ></div>
          <section>
            <hgroup>
              <h1
                className="heading-x-large"
                css={css`
                  color: var(--clr-text);
                  text-align: center;
                  margin-block-end: var(--size-200);
                `}
              >
                {transaction.status === "idle" && "Processing..."}
                {transaction.status === "success" && "Success!"}
                {transaction.status === "fail" && "Failed"}
              </h1>
              {transaction.status !== "idle" && (
                <Button onPress={() => onOpenChange(false)}>Close</Button>
              )}
            </hgroup>
          </section>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

export default WithdrawProcessingTransactionOverlay;
