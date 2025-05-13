import { useState } from "react";
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

  const userID = useSelector((state: RootState) => state.userWalletData.currentUserID);
  const solanaPubKey = useSelector((state: RootState) => state.userWalletData.solanaPubKey);
  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];

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


  const handleTransactionSubmit = async () => {
    if (!amount) return;
    if (!userID) return;
    if (!selectedToken) return;
    // toggle overlay
    // TO do: toggle the withdraw processing overlay

    // next, go through transaction

    const sellAbstractedAsset =
      assets.abstractedAssets[transaction.abstractedAssetId];
    if (!sellAbstractedAsset) return;

    // Get all assets associated with this abstracted asset
    const associatedAssets = sellAbstractedAsset.assetIds.map(
      (assetId) => assets.assets[assetId]
    );

    // Calculate the total balance in USD
    const totalBalance = associatedAssets.reduce(
      (total, asset) => total + asset.balance,
      0
    );

    // Fix: Ensure sendAmount is capped at the totalBalance
    const sendAmount =
      transaction.amount > totalBalance ? totalBalance : transaction.amount;

    const sendAmountMicro = sendAmount * 1000000;

    let assetCode = "";
    if (transaction.abstractedAssetId === "us_dollar_yield") {
      assetCode = "usdySol";
    } else if (transaction.abstractedAssetId === "us_dollar") {
      assetCode = "usdcSol";
    } else if (transaction.abstractedAssetId === "sol") {
      assetCode = "sol";
    } else if (transaction.abstractedAssetId === "euro") {
      assetCode = "eurcSol";
    } else if (transaction.abstractedAssetId === "btc") {
      assetCode = "btcSol";
    }

    console.log("sendAmount", sendAmount);
    console.log("transaction:", transaction);
    console.log("solanaPubKey:", solanaPubKey);
    console.log(
      "transaction.user.solana_pub_key:",
      transaction.user.solana_pub_key
    );
    console.log("transaction.amount:", transaction.amount);
    console.log("assetCode", assetCode);
    console.log("wallet:", wallet);
    console.log("totalBalance:", totalBalance); // Add this log to verify the total balance

    const result = await tokenTransfer(
      solanaPubKey,
      transaction.user.solana_pub_key,
      sendAmountMicro, // Use sendAmount instead of transaction.amount
      assetCode,
      wallet
    );

    if (result.success) {
      console.log("Transaction successful:", result.transactionId);
      dispatch(unmount());
      toast.success(
        `Sent $${transaction.formattedAmount} to ${
          transaction.user?.first_name ?? "user"
        }`
      );
      // TODO save transaction to db

      // TODO update user balance
      // TODO update suer interface
    } else {
      console.error("Transaction failed:", result.error);
      toast.error(`Error sending money. Please try again`);
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
                  font-size: 11px;
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
                font-size: var(--fs-large);
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