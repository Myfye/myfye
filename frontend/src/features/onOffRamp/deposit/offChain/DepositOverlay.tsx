import { useState, createContext, useContext, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import mxn from "@/assets/flags/mx.svg";
import brl from "@/assets/flags/br.svg";
import usd from "@/assets/flags/us.svg";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import Overlay from "@/shared/components/ui/overlay/Overlay";
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

const OffChainDepositOverlay = ({ isOpen, onOpenChange, zIndex = 1000 }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [totalAmount, setTotalAmount] = useState(0);
  const [showDepositInstructionsOverlay, setShowDepositInstructionsOverlay] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN"); // MXN BRL USD
  const [payin, setPayin] = useState(null);
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const blindPayEvmWalletId = useSelector(
    (state: any) => state.userWalletData.blindPayEvmWalletId
  );
  const blindPayReceiverId = useSelector(
    (state: any) => state.userWalletData.blindPayReceiverId
  );
  useEffect(() => {
    console.log("blindPayEvmWalletId", blindPayEvmWalletId);
    console.log("blindPayReceiverId", blindPayReceiverId);
  }, [blindPayEvmWalletId, blindPayReceiverId]);
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
    console.log("handleNextButtonPress");
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

  const AmountSelectContext = createContext(null);

  const AmountSelectorGroup = (props) => {
    const { children, label } = props;
    const state = useRadioGroupState(props);
    const { radioGroupProps, labelProps } = useRadioGroup(props, state);

    return (
      <>
        <p className="visually-hidden" {...labelProps}>
          {label}
        </p>
        <menu
          {...radioGroupProps}
          css={css`
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            width: min(100%, 20rem);
            gap: var(--controls-gap-small);
            margin-inline: auto;
          `}
        >
          <AmountSelectContext.Provider value={state}>
            {children}
          </AmountSelectContext.Provider>
        </menu>
      </>
    );
  };

  function AmountSelector(props) {
    let { children } = props;
    let state = useContext(AmountSelectContext);
    let ref = useRef(null);
    let { inputProps, isSelected, isDisabled, isPressed } = useRadio(
      props,
      state,
      ref
    );
    let { isFocusVisible, focusProps } = useFocusRing();

    return (
      <li>
        <motion.label
          className="button"
          data-size="small"
          data-color="neutral"
          data-variant="primary"
          data-expand="true"
          ref={ref}
          css={css`
            --_outline-opacity: 0;
            display: inline-block;
            position: relative;
            isolation: isolate;
            &::before {
              content: "";
              display: block;
              position: absolute;
              inset: 0;
              margin: auto;
              outline: 2px solid var(--clr-primary);
              outline-offset: -1px;
              z-index: 1;
              user-select: none;
              pointer-events: none;
              opacity: var(--_outline-opacity);
              border-radius: var(--border-radius-pill);
            }
          `}
          animate={{
            scale: isPressed ? 0.9 : 1,
            "--_outline-opacity": isSelected ? 1 : 0,
            "--_color": isSelected ? "var(--clr-primary)" : "var(--clr-text)",
          }}
        >
          <VisuallyHidden>
            <input {...inputProps} {...focusProps} ref={ref} />
          </VisuallyHidden>
          {children}
        </motion.label>
      </li>
    );
  }

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
        title="Deposit"
        zIndex={zIndex}
      >

          {(blindPayReceiverId && blindPayEvmWalletId) ? (

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
      <Lottie animationData={leafLoading} loop={true} style={{ width: 200, height: 200 }} />
    ) : (
      <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--size-100);
      `}
    >
  
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: var(--size-100);
        `}
      >
        <p
          css={css`
            color: var(--clr-text);
            line-height: var(--line-height-tight);
            font-size: 2.5rem;
            font-weight: var(--fw-heading);
          `}
        >
          <span>$</span>
          {formattedAmount.split("").map((val, i) => (
            <span key={`value-${i}`}>{val}</span>
          ))}
        </p>
    
        <div
          ref={dropdownRef}
          css={css`
            position: relative;
            display: flex;
            align-items: center;
            gap: var(--size-100);
            cursor: pointer;
            padding: var(--size-100);
            border-radius: var(--border-radius-small);
            background-color: var(--clr-surface-raised);
            &:hover {
              background-color: var(--clr-surface-hover);
            }
          `}
          onClick={handleDropdownToggle}
        >
          <img
            src={getCurrencyFlag(selectedCurrency)}
            alt={selectedCurrency}
            css={css`
              width: 24px;
              height: auto;
            `}
          />
          <span>{selectedCurrency}</span>
          {isDropdownOpen ? (
            <CaretUp size={24} />
          ) : (
            <CaretDown size={24} />
          )}
        </div>
      </div>

      {/* Fee display with smooth transitions */}
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
          height: formattedAmount !== "0" ? "auto" : 0
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
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
            y: formattedAmount !== "0" ? 0 : -10
          }}
          transition={{ 
            duration: 0.2,
            delay: 0.1
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
            y: formattedAmount !== "0" ? 0 : -10
          }}
          transition={{ 
            duration: 0.2,
            delay: 0.2
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
    css={css`
      width: 100%;
    `}
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
  <div
    css={css`
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      background-color: var(--clr-surface-raised);
      border-radius: var(--border-radius-medium);
      overflow: hidden;
    `}
  >
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "", "delete"].map((num) => (
      <button
        key={num}
        onClick={() => handleAmountChange(num)}
        css={css`
          display: grid;
          place-items: center;
          user-select: none;
          width: 100%;
          height: 3rem;
          line-height: var(--line-height-tight);
          font-weight: var(--fw-heading);
          color: var(--clr-text);
          font-family: var(--font-family);
          font-size: 20px;
          background-color: var(--clr-surface-raised);
          border: none;
          border-radius: 0;
          position: relative;

          &:not(:last-child)::after {
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: var(--clr-border);
          }

          &:nth-child(3n)::after {
            display: none;
          }

          &:not(:nth-last-child(-n + 3))::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: var(--clr-border);
          }
        `}
        type="button"
      >
        <motion.span
          animate={{
            scale: 1,
          }}
        >
          {num === "delete" ? (
            <Backspace size={20} weight="bold" />
          ) : (
            <span>{num}</span>
          )}
        </motion.span>
      </button>
    ))}
  </div>
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
    disabled={isSendDisabled || isLoading}
    css={css`
      opacity: ${isSendDisabled || isLoading ? 0.5 : 1};
    `}
  >
    Next
  </Button>
</section>
</div>
</div>

          ) : (
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
<div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
  <p style={{textAlign: "center"}}>Error verifying your account. Please contact support: gavin@myfye.com</p>
</div>
</section>
</div>


          )}

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
