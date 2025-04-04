import { useEffect, useMemo, useRef, useState } from "react";

import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { changeAmount, toggleModal, toggleOverlay, unmount } from "./swapSlice";
import SwapController from "./SwapController";
import { RootState } from "@/redux/store";
import ConfirmSwapOverlay from "./ConfirmSwapOverlay";
import SelectCoinOverlay from "./SelectCoinOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";

const SwapModal = () => {
  const [height] = useState(667);

  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.swap.modal.isOpen);

  const formattedBuyAmount = useSelector(
    (state: RootState) => state.swap.transaction.buy.formattedAmount
  );

  const intervalDelete = useRef<NodeJS.Timeout | null>(null);
  const delayDelete = useRef<NodeJS.Timeout | null>(null);

  const startDelete = (input: string) => {
    intervalDelete.current = setInterval(() => {
      dispatch(changeAmount({ input }));
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
    if (formattedBuyAmount === "") stopDelete();
  }, [formattedBuyAmount]);

  const handleOpen = (e: boolean) => {
    dispatch(toggleModal({ isOpen: e }));
  };

  const handleNumberPressStart = (input: string) => {
    if (input === "delete") {
      dispatch(changeAmount({ input }));
      delayDelete.current = setTimeout(() => {
        startDelete(input);
      }, 200);
    }
  };

  const handleNumberPress = (input: string) => {
    if (input === "delete") return;
    dispatch(changeAmount({ input }));
  };

  const handleNumberPressEnd = () => {
    stopDelete();
  };

  const handleSwapControllerConfirmation = () => {
    dispatch(toggleOverlay({ type: "confirmSwap", isOpen: true }));
  };

  const transaction = useSelector((state: RootState) => state.swap.transaction);

  const btcBalance = useSelector(
    (state: RootState) => state.userWalletData.btcSolBalance
  );
  const solBalance = useSelector(
    (state: RootState) => state.userWalletData.solBalance
  );
  const usdcSolBalance = useSelector(
    (state: RootState) => state.userWalletData.usdcSolBalance
  );
  const usdtSolBalance = useSelector(
    (state: RootState) => state.userWalletData.usdtSolBalance
  );
  const eurcSolBalance = useSelector(
    (state: RootState) => state.userWalletData.eurcSolBalance
  );
  const usdySolBalance = useSelector(
    (state: RootState) => state.userWalletData.usdySolBalance
  );

  const usdBalance = useMemo(
    () => usdcSolBalance + usdtSolBalance,
    [usdcSolBalance, usdtSolBalance]
  );

  const isInvalidSwapTransaction = useMemo(() => {
    if (!transaction.sell.coinId || !transaction.buy.coinId) return true;
    if (
      transaction.sell.amount === 0 ||
      transaction.sell.amount === null ||
      transaction.buy.amount === null ||
      transaction.buy.amount === 0
    )
      return true;
    switch (transaction.sell.coinId) {
      case "btcSol": {
        if (btcBalance < transaction.sell.amount) return true;
        return false;
      }
      case "sol": {
        if (solBalance < transaction.sell.amount) return true;
        return false;
      }
      case "usdcSol": {
        if (usdBalance < transaction.sell.amount) return true;
        return false;
      }
      case "usdtSol": {
        if (usdBalance < transaction.sell.amount) return true;
        return false;
      }
      case "eurcSol": {
        if (eurcSolBalance < transaction.sell.amount) return true;
        return false;
      }
      case "usdySol": {
        if (usdySolBalance < transaction.sell.amount) return true;
        return false;
      }
      default: {
        return true;
      }
    }
  }, [transaction]);

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
              isDisabled={isInvalidSwapTransaction}
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
