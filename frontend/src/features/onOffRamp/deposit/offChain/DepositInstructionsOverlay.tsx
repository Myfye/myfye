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
import { Backspace, ArrowLeft, Copy, Check } from "@phosphor-icons/react";
import { setDepositModalOpen } from "@/redux/modalReducers";

const DepositInstructionsOverlay = ({
  isOpen,
  onOpenChange,
  onBack,
  currency,
  amount,
  payin,
  onCloseAll,
}) => {
  const dispatch = useDispatch();
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [clabeAddress, setClabeAddress] = useState("");
  const [pixAddress, setPixAddress] = useState("");
  const [achAccountNumber, setAchAccountNumber] = useState("");
  const [achRoutingNumber, setAchRoutingNumber] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );

  const handleBack = () => {
    onBack();
  };

  const handleDone = () => {
    if (typeof onCloseAll === "function") {
      onCloseAll();
      dispatch(setDepositModalOpen(false));
    } else {
      onBack();
    }
  };

  const handleAmountCopy = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopiedField("amount");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddressCopy = () => {
    let addressToCopy = "";
    if (payin?.currency === "MXN") {
      addressToCopy = clabeAddress;
    } else if (payin?.currency === "BRL") {
      addressToCopy = pixAddress;
    } else if (payin?.currency === "USD") {
      addressToCopy = achAccountNumber;
    }
    
    if (addressToCopy) {
      navigator.clipboard.writeText(addressToCopy);
      setCopiedField("address");
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleBankNameCopy = () => {
    let addressToCopy = "";
    if (payin?.currency === "MXN") {
      addressToCopy = "Nvio";
    } 
    if (addressToCopy) {
      navigator.clipboard.writeText(addressToCopy);
      setCopiedField("bankName");
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  useEffect(() => {
    if (payin) {
      if (payin.currency == "MXN") {
        setClabeAddress(payin.clabe);
      } else if (payin.currency == "BRL") {
        setPixAddress(payin.pix_code);
      } else if (payin.currency == "USD") {
        setAchAccountNumber(payin.ach_account_number);
        setAchRoutingNumber(payin.ach_routing_number);
      }
    }
  }, [payin]);

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onBack();
        }
      }}
      title={payin?.currency === "MXN" ? "CLABE Instructions" : 
             payin?.currency === "BRL" ? "PIX Instructions" :
             payin?.currency === "USD" ? "ACH Instructions" : "Payment Instructions"}
    >
      <div
        css={css`
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100cqh;
          padding-block-end: var(--size-200);
        `}
      >
        <section
          css={css`
            margin-block-start: var(--size-400);
            padding-inline: var(--size-250);
          `}
        >
          <div
            css={css`
              padding: var(--size-150);
              border-radius: var(--border-radius-medium);
              background-color: var(--clr-surface-raised);
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <h2
                className="heading-medium"
                css={css`
                  color: var(--clr-text);
                `}
              >
                Amount
              </h2>
              <div
                css={css`
                  display: inline-flex;
                  align-items: center;
                  font-size: var(--fs-medium);
                  line-height: var(--line-height-tight);
                `}
              >
                <span>${payin?.sender_amount/100}</span>
                <Button
                  iconOnly
                  color="transparent"
                  size="small"
                  icon={copiedField === "amount" ? Check : Copy}
                  onClick={handleAmountCopy}
                />
              </div>
            </div>











            {currency === "MXN" && (
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-block-start: var(--size-200);
              `}
            >
              <h2
                className="heading-medium"
                css={css`
                  color: var(--clr-text);
                `}
              >
              Bank Name
              </h2>
              <div
                css={css`
                  display: inline-flex;
                  align-items: center;
                  font-size: var(--fs-medium);
                  line-height: var(--line-height-tight);
                `}
              >
                Nvio
                <Button
                  iconOnly
                  color="transparent"
                  size="small"
                  icon={copiedField === "bankName" ? Check : Copy}
                  onClick={handleBankNameCopy}
                />
              </div>
            </div>
            )}








            
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-block-start: var(--size-200);
              `}
            >
              <h2
                className="heading-medium"
                css={css`
                  color: var(--clr-text);
                `}
              >
            {currency === "MXN" ? "CLABE" : 
             currency === "BRL" ? "PIX" :
             currency === "USD" ? "ACH" : ""}

              </h2>
              <div
                css={css`
                  display: inline-flex;
                  align-items: center;
                  font-size: var(--fs-medium);
                  line-height: var(--line-height-tight);
                `}
              >
                {payin?.currency === "MXN" && (
                  <span>{clabeAddress || "Loading..."}</span>
                )}
                {payin?.currency === "BRL" && (
                  <span>{pixAddress || "Loading..."}</span>
                )}
                {payin?.currency === "USD" && (
                  <span>{achAccountNumber || "Loading..."}</span>
                )}

                <Button
                  iconOnly
                  color="transparent"
                  size="small"
                  icon={copiedField === "address" ? Check : Copy}
                  onClick={handleAddressCopy}
                />
              </div>
            </div>
          </div>
          <p
            className="caption"
            css={css`
              margin-block-start: var(--size-400);
              color: var(--clr-text);
              text-align: center;
            `}
          >
            Valid for 1 hour, Please go to your bank app to complete the deposit. Send ${payin?.sender_amount/100} to this{" "}
            {currency === "MXN" ? "CLABE" : 
             currency === "BRL" ? "PIX" :
             currency === "USD" ? "ACH" : "payment"} number. We will send you an email with these instructions too.
          </p>
          <section
            css={css`
              margin-block-start: var(--size-800);
              color: var(--clr-text);
              text-align: center;
            `}
          >
            <p>Beneficiary Name:</p> <br/>
            <p className="caption">
              {payin?.blindpay_bank_details?.beneficiary?.name}
            </p>
            <p className="caption">
              {payin?.blindpay_bank_details?.beneficiary?.address_line_1}
            </p>
            <p className="caption">
              {payin?.blindpay_bank_details?.beneficiary?.address_line_2}
            </p>
          </section>
        </section>

        <section
          css={css`
            margin-block-start: auto;
            padding-inline: var(--size-250);
          `}
        >
          <Button expand variant="primary" onPress={handleDone}>
            Done
          </Button>
        </section>
      </div>
    </Overlay>
  );
};

export default DepositInstructionsOverlay;
