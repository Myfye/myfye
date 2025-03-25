import { useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Bank, Wallet } from "@phosphor-icons/react";
import ModalButton from "../buttons/ModalButton";
import Modal from "@/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectContactOverlayOpen,
  setWithdrawCryptoOverlayOpen,
} from "@/redux/overlayReducers";
import { addCurrentCoin } from "@/redux/coinReducer";

const WithdrawModal = ({ isOpen, onOpenChange }) => {
  const [height] = useState(360);
  const dispatch = useDispatch();

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
            margin-block-start: var(--size-500);
            display: flex;
            flex-direction: column;
            gap: var(--size-200);
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
