import { useCallback, useEffect, useMemo, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Button from "@/components/ui/button/Button";
import ConfirmSwapOverlay from "./ConfirmSwapOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";
import SelectCoinOverlay from "./SelectCoinOverlay";
import { useDispatch, useSelector } from "react-redux";
import {
  SwapState,
  changeAmount,
  toggleModal,
  toggleOverlay,
} from "./swapSlice";
import SwapController from "./SwapController";
import { RootState } from "@/redux/store";

type SwapControlState = "buy" | "sell";

const SwapModal = () => {
  const [height] = useState(667);

  const dispatch = useDispatch();

  const [focusedSwapControl, setFocusedSwapControl] =
    useState<SwapControlState>("buy");

  const onFocusedSwapControlChange = (state: SwapControlState) => {
    setFocusedSwapControl(state);
  };

  const isOpen = useSelector((state: RootState) => state.swap.modal.isOpen);

  const handleNumpadChange = (e: string) => {
    changeAmount({
      type: focusedSwapControl,
      input: e,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={toggleModal}
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
            <SwapController
              focusedSwapControl={focusedSwapControl}
              onFocusedSwapControlChange={onFocusedSwapControlChange}
            />
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
      <SelectCoinOverlay />
      <ConfirmSwapOverlay />
      <ProcessingTransactionOverlay />
    </>
  );
};

export default SwapModal;
