import { useState, createContext, useContext, useRef } from "react";
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
  selectedToken,
  amount,
  onCloseAll,
}) => {
  const dispatch = useDispatch();
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [showAddressEntry, setShowAddressEntry] = useState(false);
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
    navigator.clipboard.writeText("$21");
    setCopiedField("amount");
    setTimeout(() => setCopiedField(null), 2000);
    toast.success("Amount copied to clipboard");
  };

  const handleAddressCopy = () => {
    navigator.clipboard.writeText("21461294612");
    setCopiedField("address");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onBack();
        }
      }}
      title="PIX Instructions"
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
                Send
              </h2>
              <div
                css={css`
                  display: inline-flex;
                  align-items: center;
                  font-size: var(--fs-medium);
                  line-height: var(--line-height-tight);
                `}
              >
                <span>$21</span>
                <Button
                  iconOnly
                  color="transparent"
                  size="small"
                  icon={copiedField === "amount" ? Check : Copy}
                  onClick={handleAmountCopy}
                />
              </div>
            </div>
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
                To
              </h2>
              <div
                css={css`
                  display: inline-flex;
                  align-items: center;
                  font-size: var(--fs-medium);
                  line-height: var(--line-height-tight);
                `}
              >
                <span>21461294612</span>
                <Button
                  iconOnly
                  color="transparent"
                  size="small"
                  icon={copiedField === "amount" ? Check : Copy}
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
            Please go to your bank app to complete the deposit. <br />
            Enter your Clabe/PIX/ACH/Wire value where necessary.
          </p>
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
