import { useState } from "react";
import { css } from "@emotion/react";
import { Bank, Wallet } from "@phosphor-icons/react";
import ModalButton from "../_components/ModalButton";
import Modal from "@/shared/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setWithdrawModalOpen } from "@/redux/modalReducers";
import WithdrawCryptoOverlay from "./onChain/WithdrawCryptoOverlay";
import OffChainWithdrawOverlay from "./offChain/WithdrawFiatOverlay";

const WithdrawModal = () => {
  const [height, setHeight] = useState(320);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.withdrawModal.isOpen);
  const [isCryptoOpen, setCryptoOpen] = useState(false);
  const [isFiatOpen, setFiatOpen] = useState(false);
  const [showCopiedAddress, setShowCopiedAddress] = useState(false);

  const resetModal = () => {
    setCryptoOpen(false);
    setFiatOpen(false);
    setHeight(320);
    setShowCopiedAddress(false);
  };

  const resetOverlays = () => {
    setCryptoOpen(false);
    setFiatOpen(false);
  };

  const openCrypto = () => {
    setCryptoOpen(true);
    dispatch(setWithdrawModalOpen(false)); // Close the modal when crypto overlay opens
  };

  const openFiat = () => {
    setFiatOpen(true);
    dispatch(setWithdrawModalOpen(false)); // Close the modal when fiat overlay opens
  };

  const onOpenChange = (isOpen: boolean) => {
    dispatch(setWithdrawModalOpen(isOpen));
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(setWithdrawModalOpen(isOpen));
        }}
        title="Withdraw"
        height={height}
        onExit={() => {
          resetModal();
        onAnimationComplete={() => {
          // Reset overlays when modal closes
          if (!isOpen) {
            resetOverlays();
          }
        }}
      >
        {!isCryptoOpen && !isFiatOpen ? (
          <menu
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-200);
              padding-inline: var(--size-200);
            `}
          >
            <li>
              <ModalButton
                icon={Wallet}
                title="To wallet"
                description="Send money on chain"
                onPress={openCrypto}
              />
            </li>
            <li>
              <ModalButton
                icon={Bank}
                title="To bank account"
                description="Send money to bank account"
                onPress={openFiat}
              />
            </li>
          </menu>
        ) : null}
      </Modal>
      
      {/* Render WithdrawCryptoOverlay outside the modal */}
      <WithdrawCryptoOverlay
        isOpen={isCryptoOpen}
        onOpenChange={(open) => {
          setCryptoOpen(open);
        }}
      />
      
      {/* Render OffChainWithdrawOverlay outside the modal */}
      <OffChainWithdrawOverlay
        isOpen={isFiatOpen}
        onOpenChange={(open) => {
          setFiatOpen(open);
        }}
      />
    </>
  );
};

export default WithdrawModal;
