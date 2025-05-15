import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ArrowLeft } from "@phosphor-icons/react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import WithdrawConfirmTransactionOverlay from "./WithdrawConfirmTransactionOverlay";
import WithdrawProcessingTransactionOverlay from "./WithdrawProcessingTransactionOverlay";
import { tokenTransfer } from "@/functions/Transaction";
import toast from "react-hot-toast/headless";
import { useSelector } from "react-redux";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { saveSolAddress, getRecentSolAddresses, RecentSolAddress } from "@/functions/RecentSolAddress";

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
  const [recentAddresses, setRecentAddresses] = useState<RecentSolAddress | null>(null);

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

  const userID = useSelector((state: RootState) => state.userWalletData.currentUserID);
  const solanaPubKey = useSelector((state: RootState) => state.userWalletData.solanaPubKey);
  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];

  useEffect(() => {
    const fetchRecentAddresses = async () => {
      if (userID) {
        try {
          const addresses = await getRecentSolAddresses(userID);

          setRecentAddresses(addresses);
        } catch (error) {
          console.error("Failed to fetch recent addresses:", error);
        }
      }
    };

    fetchRecentAddresses();
  }, [userID]);

  const handleConfirm = async () => {

    console.log('userID', userID);
    setShowConfirm(false);
    setShowProcessing(true);
    setProcessingStatus("idle");

    try {
    
      if (!amount) throw new Error("Amount is required");
      if (!userID) throw new Error("User ID is required");
      if (!selectedToken) throw new Error("Token is required");

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
        address,
        sendAmountMicro,
        assetCode,
        wallet
      );

      if (result.success) {
        console.log("Transaction successful:", result.transactionId);
        setProcessingStatus("success");
        toast.success(`Sent ${amount} ${selectedToken} to ${address.slice(0, 6)}...${address.slice(-4)}`);
        
        // Here if the address is not in the recent addresses, save the address to the database
        if (!recentAddresses?.addresses.includes(address)) {
          await handleSaveAddress();
        }
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      setProcessingStatus("fail");
      toast.error(error instanceof Error ? error.message : "Error sending money. Please try again");
    }
  };

  const handleProcessingClose = () => {
    setShowProcessing(false);
    if (processingStatus === "success") {
      onOpenChange(false);
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };



  const handleSaveAddress = async () => {
    try {
      await saveSolAddress(userID, address);
      
      // Update local state with the new address
      setRecentAddresses(prev => ({
        ...prev,
        addresses: prev?.addresses ? [...prev.addresses, address] : [address]
      }));
    } catch (error) {
      console.error("Failed to save recent address:", error);
    }
  };

  return (
    <>
      <Overlay 
        isOpen={isOpen} 
        onOpenChange={(newIsOpen) => {
          if (!newIsOpen) {
            onBack();
          }
        }}
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
              css={css`                border-radius: var(--border-radius-medium);
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
                  font-size: 11px;
                  font-family: monospace;
                  
                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                  }
                `}
              />
            </div>

            {recentAddresses?.addresses && recentAddresses.addresses.length > 0 && (
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: var(--size-100);
                `}
              >
                <div
                  css={css`
                    color: var(--clr-text-secondary);
                    font-size: var(--fs-small);
                    font-weight: 500;
                  `}
                >
                  My addresses
                </div>
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    gap: var(--size-100);
                  `}
                >
                  {recentAddresses.addresses.map((addr, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddressSelect(addr)}
                      css={css`
                        padding: var(--size-100) var(--size-200);
                        border: 1px solid var(--clr-border);
                        border-radius: var(--border-radius-small);
                        background-color: var(--clr-surface-raised);
                        color: var(--clr-text);
                        font-size: 11px;
                        font-family: monospace;
                        text-align: left;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                          background-color: var(--clr-surface-hover);
                          border-color: var(--clr-primary);
                        }

                        &:active {
                          background-color: var(--clr-surface-active);
                        }
                      `}
                    >
                      {addr}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div
              css={css`
                text-align: center;
                color: var(--clr-text-secondary);
                font-size: var(--fs-large);
                margin-block-start: var(--size-500);
              `}
            >
              Sending <span style={{fontWeight: 'bold'}}>{amount}</span> <span style={{fontWeight: 'bold'}}>{selectedToken}</span>
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
