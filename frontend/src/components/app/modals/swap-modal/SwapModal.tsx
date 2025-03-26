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
import NumberPad from "@/components/ui/number-pad/NumberPad";
import SwapController from "./SwapController";
import Button from "@/components/ui/button/Button";

const SwapModal = ({ isOpen, onOpenChange }) => {
  const [height] = useState(360);
  const dispatch = useDispatch();

  const currentCoin = useSelector((state: any) => state.currentCoin);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Swap"
        subtitle="Swap crypto to cash, and more!"
        height={height}
      >
        <section>
          <SwapController />
        </section>
        <section>
          <Button expand>Confirm</Button>
        </section>
        <section>
          <NumberPad />
        </section>
      </Modal>
    </>
  );
};

export default SwapModal;
