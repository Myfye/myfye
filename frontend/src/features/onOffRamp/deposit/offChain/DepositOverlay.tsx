import { useState, createContext, useContext, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import mxn from "@/assets/flags/mx.svg";
import brl from "@/assets/flags/br.svg";
import usd from "@/assets/flags/us.svg";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { setWithdrawCryptoOverlayOpen } from "@/redux/overlayReducers";
import SelectContactOverlay from "./select-contact-overlay/SelectContactOverlay";
import { addCurrentCoin } from "@/redux/coinReducer";
import { useRadioGroupState } from "react-stately";
import {
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from "react-aria";
import { selectAsset } from "@/features/assets/assetsSlice";
import Button from "@/shared/components/ui/button/Button";
import { Backspace, CaretUp, CaretDown } from "@phosphor-icons/react";
import DepositInstructionsOverlay from "./DepositInstructionsOverlay";
import { createPortal } from "react-dom";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../../../../env";
import toast from "react-hot-toast/headless";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import Lottie from "lottie-react";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import AmountSelectorGroup from "@/shared/components/ui/amount-selector/AmountSelectorGroup";
import AmountSelector from "@/shared/components/ui/amount-selector/AmountSelector";
import AmountDisplay from "@/shared/components/ui/amount-display/AmountDisplay";

// Helper function to parse and format the amount
const getFormattedNumberFromString = (amount: string): string => {
  const parsed = parseFloat(amount.replace(/,/g, ""));
  if (isNaN(parsed) || parsed === 0) return "0";
  return Math.round(parsed).toLocaleString();
};

const updateFormattedAmount = (
  formattedAmount: string,
  input: string | number,
  replace?: boolean
): string => {
  // make sure input is a string
  input = input.toString();

  if (replace) {
    const formatted = getFormattedNumberFromString(input);
    return formatted === "0" ? "0" : formatted;
  }

  if (input === "delete") {
    if (formattedAmount === "0") return "0";
    const newAmount = formattedAmount.replace(/,/g, "").slice(0, -1);
    return newAmount === ""
      ? "0"
      : Math.round(parseFloat(newAmount)).toLocaleString();
  }

  if (input === "0" && formattedAmount === "") return "0";
  if (formattedAmount === "0") return input;

  const newAmount = formattedAmount.replace(/,/g, "") + input;
  return Math.round(parseFloat(newAmount)).toLocaleString();
};

const parseFormattedAmount = (formattedAmount: string) => {
  return Math.round(parseFloat(formattedAmount.replace(/,/g, "")));
};

interface OffChainDepositOverlayProps extends OverlayProps {}

const OffChainDepositOverlay = ({
  isOpen,
  onOpenChange,
  zIndex = 1000,
}: OffChainDepositOverlayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [totalAmount, setTotalAmount] = useState(0);
  const [showDepositInstructionsOverlay, setShowDepositInstructionsOverlay] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN"); // MXN BRL USD
  const [payin, setPayin] = useState(null);

  /* Public keys */
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const blindPayEvmWalletId = useSelector(
    (state: any) => state.userWalletData.blindPayEvmWalletId
  );
  const blindPayReceiverId = useSelector(
    (state: any) => state.userWalletData.blindPayReceiverId
  );

  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );
  const isSendDisabled = !formattedAmount || formattedAmount === "0";
  const selectedAddress = solanaPubKey;
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Calculate total amount with 1% fee whenever formattedAmount changes
  useEffect(() => {
    const baseAmount = parseFormattedAmount(formattedAmount);
    const fee = baseAmount * 0.01; // 1% fee
    const total = baseAmount + fee;
    setTotalAmount(total);
  }, [formattedAmount]);

  const handleAmountChange = (input: string) => {
    setFormattedAmount(updateFormattedAmount(formattedAmount, input));
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setIsDropdownOpen(false);
  };

  const getCurrencyFlag = (currency: string) => {
    switch (currency) {
      case "MXN":
        return mxn;
      case "BRL":
        return brl;
      case "USD":
        return usd;
      default:
        return mxn;
    }
  };

  const handleNextButtonPress = async () => {
    if (isLoading) return;
    if (isSendDisabled) return;
    setIsLoading(true);
    const amount = parseFormattedAmount(formattedAmount);
    // TODO: Call the API to get the payin quote

    try {
      const payinData = await handlePayin(amount, selectedCurrency);
      setPayin(payinData);

      console.log("payin", payinData);
      setIsDropdownOpen(false);
      setShowDepositInstructionsOverlay(true);
    } catch (error) {
      console.error("Error in handleNextButtonPress:", error);
      // Error is already handled in handlePayin function
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayin = async (amount: number, currency: string) => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/new_payin`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({
          blockchain_wallet_id: blindPayEvmWalletId,
          amount: amount,
          currency: currency,
          email: currentUserEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Error please try again";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error in handlePayin:", error);
      // If it's not a response error (network error, etc.), show a generic message
      if (!error.message || error.message === "Failed to create payin") {
        toast.error("Error please try again");
      }
      throw error;
    }
  };

  const amount = parseFormattedAmount(formattedAmount);

  const handleSelectAmountChange = (presetAmount: string) => {
    let amount: number;

    switch (presetAmount) {
      case "500":
        amount = 500;
        break;
      case "1000":
        amount = 1000;
        break;
      case "5000":
        amount = 5000;
        break;
      case "10000":
        amount = 10000;
        break;
      default:
        amount = 0;
    }

    console.log("calculated amount:", amount);
    setFormattedAmount(updateFormattedAmount(formattedAmount, amount, true));
  };

  return (
    <>
      <Overlay
        isOpen={false}
        onOpenChange={onOpenChange}
        title="Deposit"
        zIndex={zIndex}
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr auto;
            gap: var(--size-200);
            padding-block-end: var(--size-200);
            height: 100cqh;
          `}
        >
          <section>
            <div
              css={css`
                display: grid;
                height: 100%;
                place-items: center;
                isolation: isolate;
                position: relative;
              `}
            >
              {isLoading ? (
                <Lottie
                  animationData={leafLoading}
                  loop={true}
                  style={{ width: 200, height: 200 }}
                />
              ) : (
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--size-100);
                  `}
                >
                  <AmountDisplay amount={formattedAmount} />
                  <motion.div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: var(--size-50);
                      margin-top: var(--size-100);
                      min-height: 3rem;
                      justify-content: center;
                    `}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: formattedAmount !== "0" ? 1 : 0,
                      height: formattedAmount !== "0" ? "auto" : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.p
                      css={css`
                        color: var(--clr-text-muted);
                        font-size: 0.875rem;
                        line-height: var(--line-height-tight);
                        margin: 0;
                      `}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: formattedAmount !== "0" ? 1 : 0,
                        y: formattedAmount !== "0" ? 0 : -10,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: 0.1,
                      }}
                    >
                      + 1% fee
                    </motion.p>
                    <motion.p
                      css={css`
                        color: var(--clr-text);
                        font-size: 1.125rem;
                        font-weight: var(--fw-heading);
                        line-height: var(--line-height-tight);
                        margin: 0;
                      `}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: formattedAmount !== "0" ? 1 : 0,
                        y: formattedAmount !== "0" ? 0 : -10,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: 0.2,
                      }}
                    >
                      Total: ${totalAmount.toLocaleString()}
                    </motion.p>
                  </motion.div>
                </div>
              )}
            </div>
          </section>
          <div
            css={css`
              display: grid;
              grid-template-rows: auto auto auto;
              gap: var(--size-200);
            `}
          >
            <section
              css={css`
                padding-inline: var(--size-200);
                margin-inline: auto;
              `}
            >
              <AmountSelectorGroup
                label="Select preset amount"
                onChange={handleSelectAmountChange}
              >
                <AmountSelector value="500">500</AmountSelector>
                <AmountSelector value="1000">1,000</AmountSelector>
                <AmountSelector value="5000">5,000</AmountSelector>
                <AmountSelector value="10000">10,000</AmountSelector>
              </AmountSelectorGroup>
            </section>
            <section
              css={css`
                padding-inline: var(--size-250);
              `}
            >
              <NumberPad onNumberPress={handleAmountChange} />
            </section>
            <section
              css={css`
                padding-inline: var(--size-200);
              `}
            >
              <Button
                expand
                variant="primary"
                onPress={handleNextButtonPress}
                isDisabled={isSendDisabled || isLoading}
                css={css`
                  opacity: ${isSendDisabled || isLoading ? 0.5 : 1};
                `}
              >
                Next
              </Button>
            </section>
          </div>
        </div>
      </Overlay>
      <DepositInstructionsOverlay
        isOpen={showDepositInstructionsOverlay}
        onOpenChange={(open) => {
          if (!open) {
            setShowDepositInstructionsOverlay(false);
          }
        }}
        onBack={() => {
          setShowDepositInstructionsOverlay(false);
          setIsLoading(false);
        }}
        currency={selectedCurrency}
        amount={amount}
        payin={payin}
        onCloseAll={() => {
          setShowDepositInstructionsOverlay(false);
          onOpenChange(false);
          setIsLoading(false);
        }}
      />
      {isDropdownOpen &&
        createPortal(
          <div
            css={css`
              position: absolute;
              top: ${dropdownPosition.top}px;
              left: ${dropdownPosition.left}px;
              background-color: var(--clr-surface-raised);
              border-radius: var(--border-radius-small);
              box-shadow: var(--shadow-elevation-2);
              z-index: 1000000;
            `}
          >
            {["MXN", "BRL"].map((currency) => (
              <div
                key={currency}
                css={css`
                  display: flex;
                  align-items: center;
                  gap: var(--size-100);
                  padding: var(--size-100);
                  cursor: pointer;
                  &:hover {
                    background-color: var(--clr-surface-hover);
                  }
                `}
                onClick={() => handleCurrencySelect(currency)}
              >
                <img
                  src={getCurrencyFlag(currency)}
                  alt={currency}
                  css={css`
                    width: 24px;
                    height: 24px;
                  `}
                />
                <span>{currency}</span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default OffChainDepositOverlay;
