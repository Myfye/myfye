import { useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import SwapController from "./SwapController";
import Button from "@/components/ui/button/Button";
import { setSwapOverlayOpen } from "@/redux/overlayReducers";
import SwapOverlay from "../../overlays/swap-overlay/SwapOverlay";

const SwapModal = ({ isOpen, onOpenChange }) => {
  const [height] = useState(667);
  const [isSwapOverlayOpen, setSwapOverlayOpen] = useState(false);

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
            margin-inline: var(--size-200);
            margin-block-start: var(--size-500);
            display: flex;
            flex-direction: column;
            min-height: fit-content;
            height: ${height};
            gap: var(--size-400);
          `}
        >
          <section>
            <SwapController />
          </section>
          <section>
            <Button expand onPress={() => setSwapOverlayOpen(true)}>
              Confirm
            </Button>
          </section>
          <section>
            <NumberPad />
          </section>
        </div>
      </Modal>
      <SwapOverlay
        isOpen={isSwapOverlayOpen}
        onOpenChange={(e) => setSwapOverlayOpen(e)}
        buyCoin="btc"
        sellCoin="usdt"
      ></SwapOverlay>
    </>
  );
};

export default SwapModal;
