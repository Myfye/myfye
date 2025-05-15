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
import { Backspace } from "@phosphor-icons/react";

const DepositInstructionsOverlay = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch();
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [showAddressEntry, setShowAddressEntry] = useState(false);
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector((state: any) => state.userWalletData.solanaPubKey);


  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Amount To Send">
      <div
            css={css`
              display: grid;
              grid-template-rows: auto 1fr auto auto;
              gap: var(--size-200);
              height: 100%;
            `}
          >

          </div>
      </Overlay>
      {showAddressEntry && (
        <AddressEntryOverlay
          isOpen={showAddressEntry}
          onOpenChange={setShowAddressEntry}
          onBack={() => setShowAddressEntry(false)}
          selectedToken={selectedToken}
          amount={formattedAmount}
        />
      )}
    </>
  );
};

export default DepositInstructionsOverlay;
