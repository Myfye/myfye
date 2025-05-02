import NumberPad from "@/shared/components/ui/number-pad/NumberPad";

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
  updateTransactionType,
} from "./paySlice";
import PayController from "./PayController";
import { useEffect, useRef } from "react";
import PaySelectUserOverlay from "./PaySelectUserOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import PaySelectAssetOverlay from "./PaySelectAssetOverlay";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import PayConfirmTransactionOverlay from "./PayConfirmTransactionOverlay";

const Pay = () => {
  const dispatch = useDispatch();

  const transaction = useSelector((state: RootState) => state.pay.transaction);
  const assets = useSelector((state: RootState) => state.assets);

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
    if (transaction.formattedAmount === "") stopDelete();
  }, [transaction]);

  const handleNumberPressStart = (input: string) => {
    if (input === "delete") {
      dispatch(updateAmount({ input }));
      delayDelete.current = setTimeout(() => {
        startDelete(input);
      }, 200);
    }
  };

  const handleNumberPress = (input: string) => {
    dispatch(updatePresetAmount(null));
    if (input === "delete") return;
    dispatch(updateAmount({ input }));
  };

  const handleNumberPressEnd = () => {
    stopDelete();
  };

  const checkIfInvalidSwapTransaction = () => {
    if (!transaction.abstractedAssetId) {
      console.warn("No abstracted asset id available");
      return true;
    }
    if (transaction.amount === 0 || transaction.amount === null) {
      console.warn("No amount available");
      return true;
    }

    // Find the specific asset ID that corresponds to the abstracted asset ID
    const sellAbstractedAsset =
      assets.abstractedAssets[transaction.abstractedAssetId];
    if (!sellAbstractedAsset) return true;

    // Loop through assets to make sure that user has assets within an abstracted asset
    const totalBalance = sellAbstractedAsset.assetIds
      .map((assetId) => assets.assets[assetId])
      .reduce((acc, val) => acc + val.balance * val.exchangeRateUSD, 0);
    // Now check the balance using the specific asset ID
    if (totalBalance < transaction.amount) return true;
    console.log(totalBalance, transaction.amount);
    return false;
  };

  const isInvalidSwapTransaction = checkIfInvalidSwapTransaction();

  const handleRequest = () => {
    dispatch(updateTransactionType("request"));
    dispatch(toggleOverlay({ type: "selectUser", isOpen: true }));
  };

  const handlePay = () => {
    dispatch(updateTransactionType("send"));
    dispatch(toggleOverlay({ type: "selectUser", isOpen: true }));
  };

  return (
    <>
      <div
        className="pay"
        css={css`
          height: 100cqh;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
            padding-block-end: var(--size-250);
          `}
        >
          <PayController />
          <section
            css={css`
              margin-block-start: auto;
              margin-block-end: var(--size-200);
              padding-inline: var(--size-250);
            `}
          >
            <NumberPad
              onNumberPress={handleNumberPress}
              onNumberPressEnd={handleNumberPressEnd}
              onNumberPressStart={handleNumberPressStart}
            ></NumberPad>
          </section>
          <section
            css={css`
              padding-inline: var(--size-250);
            `}
          >
            <ButtonGroup scroll={false} direction="horizontal" size="medium">
              <ButtonGroupItem
                expand
                onPress={handleRequest}
                isDisabled={isInvalidSwapTransaction}
              >
                Request
              </ButtonGroupItem>
              <ButtonGroupItem
                expand
                onPress={handlePay}
                isDisabled={isInvalidSwapTransaction}
              >
                Pay
              </ButtonGroupItem>
            </ButtonGroup>
          </section>
        </div>
      </div>
      <PaySelectAssetOverlay zIndex={2000} />
      <PaySelectUserOverlay zIndex={3000} />
      <PayConfirmTransactionOverlay zIndex={4000} />
      <ProcessingTransactionOverlay zIndex={5000} />
    </>
  );
};

export default Pay;
