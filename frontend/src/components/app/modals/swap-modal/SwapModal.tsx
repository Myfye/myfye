import { useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import SwapController from "./SwapController";
import Button from "@/components/ui/button/Button";
import { setSwapOverlayOpen } from "@/redux/overlayReducers";

const SwapModal = ({ isOpen, onOpenChange }) => {
  const [height] = useState(700);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Swap"
        subtitle="Swap crypto to cash, and more!"
        height={height}
      >
        <div
          css={css`
            margin-block-start: var(--size-500);
            display: flex;
            flex-direction: column;
            height: fit-content;
            gap: var(--size-500);
          `}
        >
          <section css={css``}>
            <SwapController />
          </section>
          <section>
            <Button expand onPress={() => void setSwapOverlayOpen(true)}>
              Confirm
            </Button>
          </section>
          <section css={css``}>
            <NumberPad />
          </section>
        </div>
      </Modal>
    </>
  );
};

export default SwapModal;
