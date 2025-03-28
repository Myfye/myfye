import { useCallback, useEffect, useMemo, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAmount,
  changeAmountLabel,
  toggleModal,
  toggleOverlay,
  unmount,
} from "./swapSlice";
import SwapController from "./SwapController";
import { RootState } from "@/redux/store";
import ConfirmSwapOverlay from "./ConfirmSwapOverlay";
import SelectCoinOverlay from "./SelectCoinOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";
import { parseAmountLabel } from "./utils";

const SwapModal = () => {
  const [height] = useState(667);

  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.swap.modal.isOpen);
  const buyAmountLabel = useSelector(
    (state: RootState) => state.swap.buy.amountLabel
  );
  const sellAmountLabel = useSelector(
    (state: RootState) => state.swap.sell.amountLabel
  );

  const buyAmount = useMemo(
    () => parseAmountLabel(buyAmountLabel),
    [buyAmountLabel]
  );
  const sellAmount = useMemo(
    () => parseAmountLabel(sellAmountLabel),
    [sellAmountLabel]
  );

  const activeControl = useSelector(
    (state: RootState) => state.swap.activeControl
  );

  const handleOpen = (e: boolean) => {
    dispatch(toggleModal({ isOpen: e }));
  };

  const handleNumpadChange = (e: string) => {
    dispatch(
      changeAmountLabel({
        type: activeControl,
        input: e,
      })
    );
  };

  const handleSwapControllerConfirmation = useCallback(() => {
    dispatch(changeAmount({ type: "buy", amount: buyAmount }));
    dispatch(changeAmount({ type: "sell", amount: sellAmount }));
    dispatch(toggleOverlay({ type: "confirmSwap", isOpen: true }));
  }, [buyAmount, sellAmount, changeAmount, toggleOverlay, dispatch]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Swap"
        subtitle="Swap crypto to cash, and more!"
        height={height}
        zIndex={1000}
        onAnimationComplete={() => {
          dispatch(unmount);
        }}
      >
        <div
          css={css`
            margin-block-start: var(--size-500);
            display: flex;
            flex-direction: column;
            min-height: fit-content;
            height: ${height};
            gap: var(--size-400);
          `}
        >
          <section
            css={css`
              margin-inline: var(--size-200);
            `}
          >
            <SwapController />
          </section>
          <section
            css={css`
              margin-inline: var(--size-200);
            `}
          >
            <Button expand onPress={handleSwapControllerConfirmation}>
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
