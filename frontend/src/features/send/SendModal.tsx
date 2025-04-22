import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Modal from "@/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleModal, updateAmount, updatePresetAmount } from "./sendSlice";
import { useEffect, useRef } from "react";
import SendController from "./SendController";
import SelectAssetOverlay from "./SelectAssetOverlay";

const SendModal = () => {
  const isOpen = useSelector((state: RootState) => state.send.modal.isOpen);
  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleModal({ isOpen }));
  };

  const dispatch = useDispatch();

  const transaction = useSelector((state: RootState) => state.send.transaction);
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Send"
        height={600}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
            padding-block-end: var(--size-250);
          `}
        >
          <SendController />{" "}
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
            <menu
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--controls-gap-medium);
              `}
            >
              <li>
                <Button
                  expand
                  onPress={() => {}}
                  isDisabled={isInvalidSwapTransaction}
                >
                  Request
                </Button>
              </li>
              <li>
                <Button
                  expand
                  onPress={() => {}}
                  isDisabled={isInvalidSwapTransaction}
                >
                  Pay
                </Button>
              </li>
            </menu>
          </section>
        </div>
      </Modal>
      <SelectAssetOverlay zIndex={2000} />
    </>
  );
};

export default SendModal;
