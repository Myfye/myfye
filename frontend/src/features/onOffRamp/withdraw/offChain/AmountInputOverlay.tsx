import { useState, createContext, useContext, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import usdcSol from "@/assets/usdcSol.png";
import eurcSol from "@/assets/eurcSol.png";
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
import { Backspace } from "@phosphor-icons/react";
import WithdrawConfirmOverlay from "./WithdrawConfirmOverlay";
import { HELIUS_API_KEY, MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../../../../env';

// Helper function to parse and format the amount
const getFormattedNumberFromString = (amount: string): string => {
  const parsed = parseFloat(amount.replace(/,/g, ""));
  if (isNaN(parsed) || parsed === 0) return "0";
  return parsed.toFixed(6);
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
    return formatted === "0.000000" ? "0" : formatted;
  }

  if (input === "delete") {
    if (formattedAmount === "0.") return "0";
    const newAmount = formattedAmount.slice(0, -1);
    return newAmount === "" ? "0" : newAmount;
  }

  if (input === ".") {
    if (formattedAmount === "") return "0.";
    return formattedAmount.includes(".")
      ? formattedAmount
      : formattedAmount + ".";
  }

  if (input === "0" && formattedAmount === "") return "0.";
  if (formattedAmount === "0") return input;

  const newAmount = formattedAmount + input;
  const [integer, decimal] = newAmount.split(".");

  // If we have more than 6 decimal places, truncate
  if (decimal && decimal.length > 6) {
    return integer + "." + decimal.slice(0, 6);
  }

  return newAmount;
};

const parseFormattedAmount = (formattedAmount: string) => {
  return parseFloat(formattedAmount.replace(/,/g, ""));
};

const AmountInputOverlay = ({ isOpen, onOpenChange, onBack, selectedBankAccount, selectedCurrency }) => {
  const dispatch = useDispatch();
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [payoutQuote, setPayoutQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Debug logging
  console.log("AmountInputOverlay - selectedBankAccount:", selectedBankAccount);
  console.log("AmountInputOverlay - selectedBankAccount type:", typeof selectedBankAccount);
  
  // Effect to show confirm overlay when payoutQuote is available
  useEffect(() => {
    if (payoutQuote && payoutQuote.id) {
      console.log("Payout quote:", payoutQuote);
      console.log("setting show withdraw confrim true")
      setShowWithdrawConfirm(true);
    }
  }, [payoutQuote]);
  
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );
  /* Balance */
  const eurcSolAsset = useSelector((state: RootState) => {
    const asset = selectAsset(state, "eurc_sol");
    console.log("eurc_sol asset from Redux:", asset);
    return asset;
  });
  const usdcSolAsset = useSelector((state: RootState) => {
    const asset = selectAsset(state, "usdc_sol");
    console.log("usdc_sol asset from Redux:", asset);
    return asset;
  });
  const eurcSolBalance = eurcSolAsset?.balance || 0;
  const usdcSolBalance = usdcSolAsset?.balance || 0;

  const [selectedToken, setSelectedToken] = useState("USDC");

  const selectedAddress = solanaPubKey;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedAddress);
    setShowCopiedAddress(true);
    onOpenChange(false);
  };

  const handleAmountChange = (input: string | number) => {
    setFormattedAmount(updateFormattedAmount(formattedAmount, input));
  };

  const handleMaxAmount = () => {
    const maxAmount =
      selectedToken === "USDC" ? usdcSolBalance : eurcSolBalance;
    setFormattedAmount(updateFormattedAmount(formattedAmount, maxAmount, true));
  };

  const handleNextPressed = async () => {
    const amount = parseFormattedAmount(formattedAmount);
    setLoading(true);

    console.log("selectedBankAccount:", selectedBankAccount);
    try {
      // Call backend to get payout quote
      const response = await fetch(`${MYFYE_BACKEND}/payout_quote`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({
          bank_account_id: selectedBankAccount.id,
          currency_type: 'sender',
          cover_fees: false,
          request_amount: Math.round(amount * 100)
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get payout quote');
      }
      const quote = await response.json();
      setPayoutQuote(quote);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentBalance =
    selectedToken === "USDC" ? usdcSolBalance : eurcSolBalance;
  const amount = parseFormattedAmount(formattedAmount);
  const isSendDisabled = !amount || amount > currentBalance || amount < 0.01;

  const currentCoin = useSelector((state: any) => state.currentCoin);

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
    const currentBalance =
      selectedToken === "USDC" ? usdcSolBalance : eurcSolBalance;

    console.log("presetAmount:", presetAmount);
    console.log("selectedToken:", selectedToken);
    console.log("currentBalance:", currentBalance);
    console.log("usdcSolBalance:", usdcSolBalance);
    console.log("eurcSolBalance:", eurcSolBalance);
    console.log("eurcSolAsset:", eurcSolAsset);
    console.log("usdcSolAsset:", usdcSolAsset);

    let amount: number;

    switch (presetAmount) {
      case "25":
        amount = currentBalance * 0.25;
        break;
      case "50":
        amount = currentBalance * 0.5;
        break;
      case "75":
        amount = currentBalance * 0.75;
        break;
      case "max":
        amount = currentBalance;
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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Withdraw"
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: auto 1fr auto auto;
            gap: var(--size-200);
            height: 100%;
          `}
        >

          <section
            css={css`
              display: grid;
              place-items: center;
              padding-inline: var(--size-200);
            `}
          >
            <div
              css={css`
                display: grid;
                place-items: center;
                height: 100%;
                isolation: isolate;
                position: relative;
              `}
            >
              <p
                css={css`
                  color: var(--clr-text);
                  line-height: var(--line-height-tight);
                  font-size: 3rem;
                  font-weight: var(--fw-heading);
                `}
              >
                <span>{selectedToken === "USDC" ? "$" : "€"}</span>
                {formattedAmount.split("").map((val, i) => (
                  <span key={`value-${i}`}>{val}</span>
                ))}
              </p>
            </div>
          </section>

          <section
            css={css`
              display: grid;
              place-items: center;
              padding-inline: var(--size-200);
              width: min(100%, 24rem);
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
              <AmountSelector value="25">25%</AmountSelector>
              <AmountSelector value="50">50%</AmountSelector>
              <AmountSelector value="75">75%</AmountSelector>
              <AmountSelector value="max">MAX</AmountSelector>
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "delete"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAmountChange(num)}
                  css={css`
                    display: grid;
                    place-items: center;
                    user-select: none;
                    width: 100%;
                    height: 3.5rem;
                    line-height: var(--line-height-tight);
                    font-weight: var(--fw-heading);
                    color: var(--clr-text);
                    font-family: var(--font-family);
                    font-size: 22px;
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
                      <Backspace size={24} weight="bold" />
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
              padding-block-end: var(--size-200);
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={handleNextPressed}
              disabled={isSendDisabled || loading}
            >
              {loading ? 'Loading...' : 'Next'}
            </Button>
          </section>
        </div>
      </Overlay>
      {showWithdrawConfirm && payoutQuote && (
        <WithdrawConfirmOverlay
          isOpen={showWithdrawConfirm}
          onOpenChange={(open) => {
            setShowWithdrawConfirm(open);
            if (!open) {
              setShowWithdrawConfirm(false);
            }
          }}
          onBack={() => setShowWithdrawConfirm(false)}
          payoutQuote={payoutQuote}
          selectedToken={selectedToken}
          amount={formattedAmount}
          selectedBankAccount={selectedBankAccount}
        />
      )}
    </>
  );
};

export default AmountInputOverlay;
