import { useState, createContext, useContext, useRef, useEffect } from "react";
import { css } from "@emotion/react";
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
import { createPortal } from "react-dom";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../../../../../env";
import toast from "react-hot-toast/headless";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import Lottie from "lottie-react";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import {useFundWallet} from '@privy-io/react-auth/solana';


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

const OffChainPrivyDepositOverlay = ({ isOpen, onOpenChange, zIndex = 1000 }) => {
  const {fundWallet} = useFundWallet();
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
  const solanaPriceUSD = useSelector((state: any) => state.assets.assets.sol.exchangeRateUSD);

  const solanaPubKey = useSelector((state: any) => state.userWalletData.solanaPubKey);

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
        cluster: {name: 'mainnet-beta'}, 
        amount: solAmount.toString(), // Amount in SOL
        defaultFundingMethod: 'card'
    });

  };

  const handleNumberPress = (input: string) => {
    handleAmountChange(input);
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
              <NumberPad
                onNumberPress={handleNumberPress}
              />
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
