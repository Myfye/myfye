import { useState } from "react";
import { css } from "@emotion/react";
import { Bank, Wallet } from "@phosphor-icons/react";
import ModalButton from "../_components/ModalButton";
import Modal, { ModalProps } from "@/shared/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setWithdrawModalOpen } from "@/redux/modalReducers";
import { toggleModal } from "./withdrawSlice";
import { toggleOverlay as toggleOnChainOverlay } from "./onChain/withdrawOnChainSlice";
import { toggleOverlay as toggleOffChainOverlay } from "./offChain/withdrawOffChainSlice";
import WithdrawOnChainOverlay from "./onChain/WithdrawOnChainOverlay";

const WithdrawModal = ({ height = 300, ...restProps }: ModalProps) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.withdrawModal.isOpen);

  return (
    <>
      <Modal
        {...restProps}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleModal(isOpen));
        }}
        title="Withdraw"
        height={height}
        zIndex={1000}
      >
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
                dispatch(
                  toggleOnChainOverlay({
                    type: "withdrawOnChain",
                    isOpen: true,
                  })
                );
              }}
            />
          </li>
          <li>
            <ModalButton
              icon={Bank}
              title="To bank account"
              description="Send money to bank account"
              onPress={() => {
                dispatch(
                  toggleOffChainOverlay({
                    type: "withdrawOffChain",
                    isOpen: true,
                  })
                );
              }}
            />
          </li>
        </menu>
      </Modal>
      {/* On Chain */}
      <WithdrawOnChainOverlay zIndex={2000} />
    </>
  );
};

export default WithdrawModal;
