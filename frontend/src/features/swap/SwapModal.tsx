import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  const userWalletData = useSelector(
    (state: RootState) => state.userWalletData
  );

  const sellCoin = useSelector((state: RootState) => state.swap.sell.coin);

  const buyAmountLabel = useSelector(
    (state: RootState) => state.swap.buy.amountLabel
  );
  const sellAmountLabel = useSelector(
    (state: RootState) => state.swap.sell.amountLabel
  );

  const buyAmount = parseAmountLabel(buyAmountLabel);

  const sellAmount = parseAmountLabel(sellAmountLabel);

  const deleteInterval = useRef<number | null>(null);

  const startDelete = (input: string) => {
    deleteInterval.current = setInterval(() => {
      dispatch(changeAmountLabel({ input }));
    }, 50);
  };

  const stopDelete = () => {
    if (deleteInterval.current) {
      clearInterval(deleteInterval.current);
    }
  };

  useEffect(() => {
    if (buyAmountLabel === "") stopDelete();
  }, [buyAmountLabel]);

  const handleOpen = (e: boolean) => {
    dispatch(toggleModal({ isOpen: e }));
  };

  const handleNumberPressStart = (input: string) => {
    if (input === "delete") startDelete(input);
  };

  const handleNumberPress = (input: string) => {
    if (input === "delete") return;
    dispatch(changeAmountLabel({ input }));
  };

  const handleNumberPressEnd = () => {
    stopDelete();
  };

  const handleSwapControllerConfirmation = useCallback(() => {
    dispatch(changeAmount({ transactionType: "sell", amount: sellAmount }));
    dispatch(changeAmount({ transactionType: "buy", amount: buyAmount }));
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
          if (!isOpen) {
            dispatch(unmount(undefined));
          }
        }}
      >
        <div
          css={css`
            margin-block-start: var(--size-400);
            display: flex;
            flex-direction: column;
            min-height: fit-content;
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
          <section>
            <NumberPad
              onNumberPress={handleNumberPress}
              onNumberPressStart={handleNumberPressStart}
              onNumberPressEnd={handleNumberPressEnd}
            />
          </section>
          <section
            css={css`
              margin-inline: var(--size-200);
            `}
          >
            <Button
              isDisabled={isNaN(sellAmount)}
              expand
              onPress={handleSwapControllerConfirmation}
            >
              Confirm
            </Button>
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
