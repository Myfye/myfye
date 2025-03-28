import { useCallback, useEffect, useMemo, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { changeAmount, toggleModal, toggleOverlay } from "./swapSlice";
import SwapController from "./SwapController";
import { RootState } from "@/redux/store";
import ConfirmSwapOverlay from "./ConfirmSwapOverlay";
import SelectCoinOverlay from "./SelectCoinOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";

const SwapModal = () => {
  const [height] = useState(667);

  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.swap.modal.isOpen);

  const activeControl = useSelector(
    (state: RootState) => state.swap.activeControl
  );

  const handleOpen = (e: boolean) => {
    dispatch(toggleModal({ isOpen: e }));
  };

  const handleNumpadChange = (e: string) => {
    changeAmount({
      type: activeControl,
      input: e,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpen}
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
            <Button
              expand
              onPress={() => {
                dispatch(toggleOverlay({ type: "confirmSwap", isOpen: true }));
              }}
            >
              Confirm
            </Button>
          </section>
          <section>
            <NumberPad onChange={handleNumpadChange} />
          </section>
        </div>
      </Modal>
      <ConfirmSwapOverlay zIndex={2000} />
      <SelectCoinOverlay zIndex={2000} />
      <ProcessingTransactionOverlay zIndex={3000} />
    </>
  );
};

export default SwapModal;
