import { useState } from "react";
import { css } from "@emotion/react";
import { ArrowLeft } from "@phosphor-icons/react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import WithdrawConfirmTransactionOverlay from "./WithdrawConfirmTransactionOverlay";
import WithdrawProcessingTransactionOverlay from "./WithdrawProcessingTransactionOverlay";

interface AddressEntryOverlayProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBack: () => void;
  selectedToken: string;
  amount: string;
}

const AddressEntryOverlay = ({ 
  isOpen, 
  onOpenChange, 
  onBack,
  selectedToken,
  amount 
}: AddressEntryOverlayProps) => {
  const [address, setAddress] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<"idle" | "success" | "fail">("idle");

  // Solana address validation regex
  const isValidSolanaAddress = (addr: string) => {
    // Solana addresses are 32-44 characters long and base58 encoded
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(addr);
  };

  const handleNext = () => {
    if (isValidSolanaAddress(address)) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setShowProcessing(true);
    setProcessingStatus("idle");

    try {
      // TODO: Implement actual withdrawal logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      setProcessingStatus("success");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      setProcessingStatus("fail");
    }
  };

  const handleProcessingClose = () => {
    setShowProcessing(false);
    if (processingStatus === "success") {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Overlay 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        title="Enter Address"
        leftIcon={<ArrowLeft size={24} />}
        onLeftIconClick={onBack}
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: auto 1fr auto;
            gap: var(--size-200);
            height: 100%;
            padding: var(--size-200);
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-200);
              width: min(100%, 24rem);
              margin-inline: auto;
            `}
          >
            <div
              css={css`
                border-radius: var(--border-radius-medium);
                padding: var(--size-100);
              `}
            >
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Solana address"
                css={css`
                  width: 100%;
                  padding: var(--size-200);
                  border: 1px solid var(--clr-border);
                  border-radius: var(--border-radius-small);
                  background-color: var(--clr-surface-raised);
                  color: var(--clr-text);
                  font-size: 0.75rem;
                  font-family: monospace;
                  
                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                  }
                `}
              />
            </div>
            
            <div
              css={css`
                text-align: center;
                color: var(--clr-text-secondary);
                font-size: var(--fs-small);
                margin-block-start: var(--size-500);
              `}
            >
              Sending {amount} {selectedToken}
            </div>
          </div>

          <div
            css={css`
              padding: var(--size-200);
              padding-top: 0;
              width: 350px;
              margin: auto;
              text-align: center;
            `}
          >
            <Button
              variant="primary"
              onPress={handleNext}
              disabled={!isValidSolanaAddress(address)}
              css={css`
                width: 300px !important;
                min-width: 250px !important;
                max-width: 250px !important;
                opacity: ${!isValidSolanaAddress(address) ? 0.5 : 1};
                transition: opacity 0.2s ease;
                display: inline-block;
              `}
            >
              Next
            </Button>
          </div>
        </div>
      </Overlay>

      <WithdrawConfirmTransactionOverlay
        isOpen={showConfirm}
        onOpenChange={setShowConfirm}
        onBack={() => setShowConfirm(false)}
        selectedToken={selectedToken}
        amount={amount}
        address={address}
        onConfirm={handleConfirm}
      />

      <WithdrawProcessingTransactionOverlay
        isOpen={showProcessing}
        onOpenChange={setShowProcessing}
        status={processingStatus}
        onClose={handleProcessingClose}
      />
    </>
  );
};

export default AddressEntryOverlay; 