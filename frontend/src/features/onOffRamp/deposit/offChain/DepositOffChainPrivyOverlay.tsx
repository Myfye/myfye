import { useState, useRef } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import toast from "react-hot-toast/headless";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import { useFundWallet } from "@privy-io/react-auth/solana";

const OffChainPrivyDepositOverlay = () => {
  const { fundWallet } = useFundWallet();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [payin, setPayin] = useState(null);
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );

  // Get Solana price from assets slice
  const solanaPriceUSD = useSelector(
    (state: any) => state.assets.assets.sol.exchangeRateUSD
  );

  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );

  const isSendDisabled = !formattedAmount || formattedAmount === "0";
  const selectedAddress = solanaPubKey;
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedAddress);
    setShowCopiedAddress(true);
    onOpenChange(false);
  };

  const handleAmountChange = (input: string | number) => {
    setFormattedAmount(updateFormattedAmount(formattedAmount, input));
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setIsDropdownOpen(false);
  };

  const handleNextButtonPress = async () => {
    console.log("handleNextButtonPress");
    console.log("Amount:", amount);
    console.log("Solana price in USD:", solanaPriceUSD);

    // Check if Solana exchange rate is valid
    if (!solanaPriceUSD || solanaPriceUSD <= 0) {
      toast.error("Unable to get Solana price. Please try again.");
      return;
    }

    // Convert USD amount to SOL
    let solAmount = 0;
    if (solanaPriceUSD > 0) {
      solAmount = amount / solanaPriceUSD;
      console.log("Converted amount in SOL:", solAmount);
    } else {
      toast.error("Unable to get Solana price. Please try again.");
      return;
    }

    // Prompts user to fund their wallet with SOL on Solana's mainnet.
    fundWallet(solanaPubKey, {
      cluster: { name: "mainnet-beta" },
      amount: solAmount.toString(), // Amount in SOL
      defaultFundingMethod: "card",
    });
  };

  const handleNumberPress = (input: string) => {
    handleAmountChange(input);
  };

  const amount = parseFormattedAmount(formattedAmount);

  const handleDropdownToggle = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDropdownOpen(false);
          }
          onOpenChange(open);
        }}
        title="Deposit With Card"
        zIndex={zIndex}
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr auto;
            gap: var(--size-200);
            height: 100%;
            padding-block-end: var(--size-200);
          `}
        >
          <div>
            <div
              css={css`
                padding-inline: var(--size-250);
                margin-block-end: var(--size-200);
              `}
            >
              <div
                css={css`
                  font-size: 2rem;
                  font-weight: bold;
                  text-align: center;
                  margin-block: var(--size-200);
                  padding: var(--size-200);
                  background-color: var(--clr-surface-raised);
                  border-radius: var(--border-radius-medium);
                `}
              >
                ${formattedAmount}
              </div>
            </div>
          </div>
          <div>
            <section
              css={css`
                padding-inline: var(--size-250);
                margin-block-end: var(--size-200);
              `}
            >
              <NumberPad onNumberPress={handleNumberPress} />
            </section>
            <section
              css={css`
                padding-inline: var(--size-250);
              `}
            >
              <Button
                expand
                onPress={handleNextButtonPress}
                isDisabled={isSendDisabled}
              >
                Next
              </Button>
            </section>
          </div>
        </div>
      </Overlay>
    </>
  );
};

export default OffChainPrivyDepositOverlay;
