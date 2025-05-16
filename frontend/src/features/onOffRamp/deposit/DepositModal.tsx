import { useEffect, useState } from "react";

import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { Bank, Copy, Wallet, X } from "@phosphor-icons/react";
import ModalButton from "../ModalButton";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/shared/components/ui/modal/Modal";
import { RootState } from "@/redux/store";
import { setDepositModalOpen } from "@/redux/modalReducers";
// import toast from "react-hot-toast/headless";
import OnChainDepositOverlay from "./onChain/OnChainDepositContent";
import OffChainDepositOverlay from "./offChain/DepositOverlay";

const DepositModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.depositModal.isOpen);
  const onOpenChange = (isOpen: boolean) => {
    dispatch(setDepositModalOpen(isOpen));
  };
  const [showCopiedAddress, setShowCopiedAddress] = useState(false);

  const [onChainDepositOpen, setOnChainDepositOpen] = useState(false);
  const [offChainDepositOpen, setOffChainDepositOpen] = useState(false);

  const resetModal = () => {
    setOnChainDepositOpen(false);
    setOffChainDepositOpen(false);
    setShowCopiedAddress(false);
  };

  const openOnChainDeposit = () => {
    setOnChainDepositOpen(true);
  };

  const openOffChainDeposit = () => {
    setOffChainDepositOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Deposit"
        height={320}
        onAnimationComplete={() => {
          isOpen && resetModal();
        }}
      >
        {!offChainDepositOpen && !onChainDepositOpen && (
          <menu
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-150);
              padding-inline: var(--size-200);
            `}
          >
            <li>
              <ModalButton
                icon={Wallet}
                title="Wallet"
                description="Deposit via wallet address"
                onPress={openOnChainDeposit}
              ></ModalButton>
            </li>
            <li>
              <ModalButton
                icon={Bank}
                title="Fiat"
                description="Deposit via bank transfer"
                onPress={openOffChainDeposit}
              ></ModalButton>
            </li>
          </menu>
        )}
      </Modal>

      <Modal
        isOpen={onChainDepositOpen}
        onOpenChange={setOnChainDepositOpen}
        title="Deposit"
        height={580}
      >
        <OnChainDepositOverlay
          isOpen={onChainDepositOpen}
          onOpenChange={setOnChainDepositOpen}
        />
      </Modal>

      {offChainDepositOpen && (
        <OffChainDepositOverlay
          isOpen={offChainDepositOpen}
          onOpenChange={setOffChainDepositOpen}
        />
      )}
    </>
  );
};

export default DepositModal;
