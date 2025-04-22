import { useEffect, useMemo, useRef, useState } from "react";

import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal, toggleOverlay, unmount, updateAmount } from "./swapSlice";
import SwapController from "./SwapController";
import { RootState } from "@/redux/store";
import ConfirmSwapOverlay from "./ConfirmSwapOverlay";
import SelectCoinOverlay from "./SelectAssetOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";

const SwapModal = () => {
  const [height] = useState(667);

  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.swap.modal.isOpen);

  const transaction = useSelector((state: RootState) => state.swap.transaction);
  const assets = useSelector((state: RootState) => state.assets);
  const zIndex = useSelector((state: RootState) => state.swap.modal.zIndex);

  const intervalDelete = useRef<NodeJS.Timeout | null>(null);
  const delayDelete = useRef<NodeJS.Timeout | null>(null);

  const startDelete = (input: string) => {
    intervalDelete.current = setInterval(() => {
      dispatch(updateAmount({ input }));
    }, 50);
  };

  const stopDelete = () => {
    if (intervalDelete.current) {
      clearInterval(intervalDelete.current);
    }
    if (delayDelete.current) {
      clearTimeout(delayDelete.current);
    }
  };

  useEffect(() => {
    if (transaction.buy.formattedAmount === "") stopDelete();
  }, [transaction]);

  const handleOpen = (e: boolean) => {
    dispatch(toggleModal({ isOpen: e }));
  };

  const handleNumberPressStart = (input: string) => {
    if (input === "delete") {
      dispatch(updateAmount({ input }));
      delayDelete.current = setTimeout(() => {
        startDelete(input);
      }, 200);
    }
  };

  const handleNumberPress = (input: string) => {
    if (input === "delete") return;
    dispatch(updateAmount({ input }));
  };

  const handleNumberPressEnd = () => {
    stopDelete();
  };

  const handleSwapControllerConfirmation = () => {
    dispatch(toggleOverlay({ type: "confirmSwap", isOpen: true }));
  };

  const checkIfInvalidSwapTransaction = () => {
    if (
      !transaction.sell.abstractedAssetId ||
      !transaction.buy.abstractedAssetId
    ) {
      console.warn("No buy/sell available");
      return true;
    }
    if (
      transaction.sell.amount === 0 ||
      transaction.sell.amount === null ||
      transaction.buy.amount === null ||
      transaction.buy.amount === 0
    ) {
      console.warn("No buy/sell amounts");
      return true;
    }

    // Find the specific asset ID that corresponds to the abstracted asset ID
    const sellAbstractedAsset =
      assets.abstractedAssets[transaction.sell.abstractedAssetId];
    if (!sellAbstractedAsset) return true;

    // Loop through assets to make sure that user has assets within an abstracted asset
    const totalBalance = sellAbstractedAsset.assetIds
      .map((assetId) => assets.assets[assetId])
      .reduce((acc, val) => acc + val.balance, 0);
    // Now check the balance using the specific asset ID
    if (totalBalance < transaction.sell.amount) return true;
    return false;
  };

  const isInvalidSwapTransaction = checkIfInvalidSwapTransaction();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Swap"
        height={height}
        zIndex={zIndex}
        onAnimationComplete={() => {
          if (!isOpen) {
            dispatch(unmount(undefined));
          }
        }}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100cqh;
            justify-content: space-between;
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
              margin-block-start: auto;
              margin-block-end: var(--size-200);
              padding-inline: var(--size-200);
            `}
          >
            <NumberPad
              onNumberPress={handleNumberPress}
              onNumberPressStart={handleNumberPressStart}
              onNumberPressEnd={handleNumberPressEnd}
            />
          </section>
          <section
            css={css`
              margin-inline: var(--size-200);
              margin-block-end: var(--size-200);
            `}
          >
            <Button
              isDisabled={isInvalidSwapTransaction}
              expand
              onPress={handleSwapControllerConfirmation}
            >
              Confirm
            </Button>
          </section>
        </div>
      </Modal>
      <ConfirmSwapOverlay zIndex={9999 + 1} />
      <SelectCoinOverlay zIndex={9999 + 2} />
      <ProcessingTransactionOverlay zIndex={9999 + 3} />
    </>
  );
};

export default SwapModal;
