import { useState } from "react";
import { css } from "@emotion/react";
import { Bank, Wallet } from "@phosphor-icons/react";
import ModalButton from "../ModalButton";
import Modal from "@/shared/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setWithdrawModalOpen } from "@/redux/modalReducers";
import WithdrawCryptoOverlay from "./onChain/WithdrawCryptoOverlay";

const WithdrawModal = () => {
  const [height, setHeight] = useState(320);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.withdrawModal.isOpen);
  const [isCryptoOpen, setCryptoOpen] = useState(false);
  const [_, setShowCopiedAddress] = useState(false);

  const resetModal = () => {
    setCryptoOpen(false);
    setHeight(320);
    setShowCopiedAddress(false);
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
        onAnimationComplete={() => {
          isOpen && resetModal();
        }}
      >
        {!isCryptoOpen ? (
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
                onPress={() => {
                  setCryptoOpen(true);
                  setHeight(680);
                }}
              />
            </li>
            <li>
              <ModalButton
                icon={Bank}
                title="To bank account"
                description="Send money to bank account"
              />
            </li>
          </menu>
        ) : (
          <WithdrawCryptoOverlay
            isOpen={isCryptoOpen}
            onOpenChange={(open) => {
              setCryptoOpen(open);
              if (!open) {
                setHeight(360);
              }
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default WithdrawModal;
