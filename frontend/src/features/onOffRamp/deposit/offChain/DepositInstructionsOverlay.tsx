import { useState, createContext, useContext, useRef } from "react";
import { css } from "@emotion/react";
import usdcSol from '@/assets/usdcSol.png';
import eurcSol from '@/assets/eurcSol.png';
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

const DepositInstructionsOverlay = ({ isOpen, onOpenChange, onBack, selectedToken, amount, onCloseAll }) => {
  const dispatch = useDispatch();
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [showAddressEntry, setShowAddressEntry] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector((state: any) => state.userWalletData.solanaPubKey);

  const handleBack = () => {
    onBack();
  };

  const handleDone = () => {
    if (typeof onCloseAll === 'function') {
      onCloseAll();
      dispatch(setDepositModalOpen(false));
    } else {
      onBack();
    }
  };

  const handleAmountCopy = () => {
    navigator.clipboard.writeText("$21");
    setCopiedField('amount');
    setTimeout(() => setCopiedField(null), 2000);
    toast.success("Amount copied to clipboard");
  };

  const handleAddressCopy = () => {
    navigator.clipboard.writeText("21461294612");
    setCopiedField('address');
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
      onBack={handleBack}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7vh;
          flex-direction: column;
          min-height: 85vh;
          max-height: 85vh;
          position: relative;
        `}
      >
        <div
          css={css`
            background: white;
            border-radius: 16px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 80%;
          `}
        >
          <h3
            css={css`
              text-align: center;
              margin: 0;
              font-size: 18px;
            `}
          >
            Send
          </h3>
          <div
            css={css`
              border: 2.5px solid #00A958;
              border-radius: 24px;
              padding: 10px;
              display: flex;
              align-items: center;
              position: relative;
            `}
          >
            <span
              css={css`
                font-size: 20px;
                font-weight: 500;
                text-align: center;
                width: 100%;
                position: absolute;
                left: 0;
                right: 0;
              `}
            >
              $21
            </span>
            <button
              onClick={handleAmountCopy}
              css={css`
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 1;
                margin-left: auto;
                &:hover {
                  opacity: 0.8;
                }
              `}
            >
              {copiedField === 'amount' ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div
          css={css`
            background: white;
            border-radius: 16px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 80%;
          `}
        >
          <h3
            css={css`
              text-align: center;
              margin: 0;
              font-size: 18px;
            `}
          >
            To
          </h3>
          <div
            css={css`
              border: 2.5px solid #00A958;
              border-radius: 24px;
              padding: 10px;
              display: flex;
              align-items: center;
              position: relative;
            `}
          >
            <span
              css={css`
                font-size: 20px;
                font-weight: 500;
                text-align: center;
                width: 100%;
                position: absolute;
                left: 0;
                right: 0;
              `}
            >
              21461294612
            </span>
            <button
              onClick={handleAddressCopy}
              css={css`
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 1;
                margin-left: auto;
                &:hover {
                  opacity: 0.8;
                }
              `}
            >
              {copiedField === 'address' ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <p style={{textAlign: 'center', width: '80%'}}>
            Please go to your bank app to complete the deposit. We are expecting amount to be sent to clabe/pix/ACH/wire number via clabe/pix/ACH/Wire
          </p>
        </div>

        <div
          css={css`
            display: flex;
            justify-content: center;
            padding: 0 24px;
          `}
        >
          <Button
            variant="primary"
            onPress={handleDone}
            css={css`
              width: 300px !important;
              min-width: 250px !important;
              max-width: 250px !important;
            `}
          >
            Done
          </Button>
        </div>
      </div>
    </Overlay>
  );
};

export default DepositInstructionsOverlay;
