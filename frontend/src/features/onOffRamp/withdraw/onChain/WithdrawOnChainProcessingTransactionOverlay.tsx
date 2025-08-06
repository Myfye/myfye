import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";

interface WithdrawProcessingTransactionOverlayProps extends OverlayProps {
  status: "idle" | "success" | "fail";
}

const WithdrawProcessingTransactionOverlay = ({
  isOpen,
  onOpenChange,
  status,
}: WithdrawProcessingTransactionOverlayProps) => {
  const handleConfirm = async () => {
    console.log("userID", userId);

    try {
      if (!amount) throw new Error("Amount is required");
      if (!userId) throw new Error("User ID is required");
      if (!selectedToken) throw new Error("Token is required");
      if (!solAddress) throw new Error("Sol address is required");

      let assetCode = "";
      if (selectedToken === "USDC") {
        assetCode = "usdcSol";
      } else if (selectedToken === "EURC") {
        assetCode = "eurcSol";
      }

      const sendAmount = parseFloat(amount);
      const sendAmountMicro = sendAmount * 1000000;

      const result = await tokenTransfer(
        solanaPubKey,
        solAddress,
        sendAmountMicro,
        assetCode,
        wallet
      );

      if (result.success) {
        console.log("Transaction successful:", result.transactionId);
        toast.success(
          `Sent ${amount} ${selectedToken} to ${solAddress.slice(
            0,
            6
          )}...${solAddress.slice(-4)}`
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
        <section css={css``}>
          <div
            css={css`
              width: 12rem;
              aspect-ratio: 1;
              margin-inline: auto;
            `}
          >
            {/* <UIAnimation status={status} /> */}
          </div>
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
                {status === "idle" && "Processing..."}
                {status === "success" && "Success!"}
                {status === "fail" && "Failed"}
              </h1>
              {status !== "idle" && (
                <button
                  css={css`
                    text-align: center;
                    width: 100%;
                  `}
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </button>
              )}
            </hgroup>
          </section>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

export default WithdrawProcessingTransactionOverlay;
