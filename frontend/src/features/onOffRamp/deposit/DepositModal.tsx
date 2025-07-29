import { useState } from "react";

import { css } from "@emotion/react";
import { Bank, Wallet } from "@phosphor-icons/react";
import ModalButton from "../_components/ModalButton";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/shared/components/ui/modal/Modal";
import { RootState } from "@/redux/store";
import { setDepositModalOpen } from "@/redux/modalReducers";
// import toast from "react-hot-toast/headless";
import OnChainDepositContent from "./onChain/OnChainDepositContent";
import OffChainDepositOverlay from "./offChain/DepositOverlay";
import KYCOverlay from "@/features/compliance/kycOverlay";
import { toggleModal as toggleKYCModal } from "@/features/compliance/kycSlice";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

const DepositModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.depositModal.isOpen);
  const height = useMotionValue(320);

  const onOpenChange = (isOpen: boolean) => {
    dispatch(setDepositModalOpen(isOpen));
  };

  const [showCopiedAddress, setShowCopiedAddress] = useState(false);

  const [isOnChainDepositOpen, setOnChainDepositOpen] = useState(false);
  const [isOffChainDepositOpen, setOffChainDepositOpen] = useState(false);
  const [showKYCOverlay, setShowKYCOverlay] = useState(false);

  const currentUserKYCVerified = useSelector(
    (state: RootState) => state.userWalletData.currentUserKYCVerified
  );

  const resetModal = () => {
    setOnChainDepositOpen(false);
    setOffChainDepositOpen(false);
    setShowCopiedAddress(false);
  };

  const toggleOnChainDepositScreen = async (isOpen: boolean) => {
    if (isOpen) {
      await animate(height, 420, {
        type: "inertia",
        bounceStiffness: 300,
        bounceDamping: 40,
        timeConstant: 300,
        min: 420,
        max: 420,
      });
    }
    // setOnChainDepositOpen(isOpen);
  };

  const openOffChainDeposit = () => {
    console.log("currentUserKYCVerified", currentUserKYCVerified);
    if (!currentUserKYCVerified) {
      //setShowKYCOverlay(true);
      dispatch(toggleKYCModal({ isOpen: true }));
    } else {
      setOffChainDepositOpen(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Deposit"
        height={height}
        onExit={() => {
          resetModal();
          height.set(320);
        }}
      >
        {isOnChainDepositOpen ? (
          <OnChainDepositContent onAddressCopy={() => onOpenChange(false)} />
        ) : (
          <menu
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-150);
              padding-inline: var(--size-200);
            `}
          >
            <ModalButton
              icon={Wallet}
              title="Wallet"
              description="Deposit via wallet address"
              onPress={async () =>
                void (await toggleOnChainDepositScreen(true))
              }
            />
            <ModalButton
              icon={Bank}
              title="Fiat"
              description="Deposit via bank transfer"
              onPress={openOffChainDeposit}
            />
          </menu>
        )}
      </Modal>
      {/* {offChainDepositOpen && (
        <OffChainDepositOverlay
          isOpen={offChainDepositOpen}
          onOpenChange={setOffChainDepositOpen}
        />
      )}
      {showKYCOverlay && (
        <KYCOverlay
          isOpen={showKYCOverlay}
          onBack={() => setShowKYCOverlay(false)}
        />
      )} */}
    </>
  );
};

export default DepositModal;
