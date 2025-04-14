import { useState } from "react";

import { css } from "@emotion/react";
import { Bank, Wallet } from "@phosphor-icons/react";
import ModalButton from "../ModalButton";
import Modal from "@/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectContactOverlayOpen,
  setWithdrawCryptoOverlayOpen,
} from "@/redux/overlayReducers";
import { RootState } from "@/redux/store";
import { setWithdrawModalOpen } from "@/redux/modalReducers";

const WithdrawModal = () => {
  const [height] = useState(360);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.withdrawModal.isOpen);
  const onOpenChange = (isOpen: boolean) => {
    dispatch(setWithdrawModalOpen(isOpen));
  };

  const currentCoin = useSelector((state: any) => state.currentCoin);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Withdraw"
        height={height}
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
              description="Send money to crypto wallet"
              onPress={() => {
                if (currentCoin)
                  return dispatch(setSelectContactOverlayOpen(true));
                dispatch(setWithdrawCryptoOverlayOpen(true));
              }}
            ></ModalButton>
          </li>
          <li>
            <ModalButton
              icon={Bank}
              title="To bank account"
              description="Send money to bank account"
            ></ModalButton>
          </li>
        </menu>
      </Modal>
    </>
  );
};

export default WithdrawModal;
