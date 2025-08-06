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
import KYCOverlay from "@/features/compliance/KYCOverlay";
import { toggleModal as toggleKYCModal } from "@/features/compliance/kycSlice";
import { animate, AnimatePresence, useMotionValue } from "motion/react";
import toast from "react-hot-toast/headless";

const DepositModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.depositModal.isOpen);
  const height = useMotionValue(320);

  const onOpenChange = (isOpen: boolean) => {
    dispatch(setDepositModalOpen(isOpen));
  };

  const [isOnChainDepositOpen, setOnChainDepositOpen] = useState(false);
  const [isOffChainDepositOpen, setOffChainDepositOpen] = useState(false);

  const currentUserKYCVerified = useSelector(
    (state: RootState) => state.userWalletData.currentUserKYCVerified
  );

  const resetModal = () => {
    setOnChainDepositOpen(false);
    setOffChainDepositOpen(false);
  };

  const toggleOnChainDepositScreen = async (isOpen: boolean) => {
    setOnChainDepositOpen(isOpen);
    if (isOpen) {
      await animate(height, 400, {
        type: "inertia",
        bounceStiffness: 300,
        bounceDamping: 40,
        timeConstant: 300,
        min: 400,
        max: 400,
      });
    }
  };

  const onOffChainDepositScreenOpen = (isOpen: boolean) => {
    // if (!currentUserKYCVerified) {
    //   dispatch(toggleKYCModal({ isOpen: true }));
    // } else {
    //   setOffChainDepositOpen(isOpen);
    // }
    setOffChainDepositOpen(isOpen);
  };

  return (
    <>
      <Modal
        zIndex={1000}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Deposit"
        height={height}
        onExit={() => {
          resetModal();
          height.set(320);
        }}
      >
        <AnimatePresence>
          {isOnChainDepositOpen ? (
            <OnChainDepositContent
              onAddressCopy={(address) => {
                navigator.clipboard.writeText(address);
                toast.success("Copied wallet address!");
                onOpenChange(false);
              }}
            />
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
                onPress={() => void onOffChainDepositScreenOpen(true)}
              />
            </menu>
          )}
        </AnimatePresence>
      </Modal>
      <OffChainDepositOverlay
        isOpen={isOffChainDepositOpen}
        onOpenChange={(isOpen) => setOffChainDepositOpen(isOpen)}
        zIndex={9999}
      />
    </>
  );
};

export default DepositModal;
