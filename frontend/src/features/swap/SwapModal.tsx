import { useEffect, useRef, useState } from "react";

import { css } from "@emotion/react";
import Modal from "@/shared/components/ui/modal/Modal";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  toggleOverlay,
  unmount,
  updateAmount,
  updateUserId,
  updateInputPublicKey,
  updateOutputPublicKey,
} from "./swapSlice";
import SwapController from "./SwapController";
import { RootState } from "@/redux/store";
import ConfirmSwapOverlay from "./ConfirmSwapOverlay";
import SelectSwapAssetOverlay from "./SelectSwapAssetOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";

const SwapModal = () => {
  const [height] = useState(667);

  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.swap.modal.isOpen);

  const transaction = useSelector((state: RootState) => state.swap.transaction);
  const assets = useSelector((state: RootState) => state.assets);
  const zIndex = useSelector((state: RootState) => state.swap.modal.zIndex);

  const intervalDelete = useRef<NodeJS.Timeout | null>(null);
  const delayDelete = useRef<NodeJS.Timeout | null>(null);

  const user_id = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );
  const solanaPubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );
  const evmPubKey = useSelector(
    (state: RootState) => state.userWalletData.evmPubKey
  );

  const numberPadProps = useNumberPad({
    onStartDelete: (input) => {
      updateAmount({ input });
    },
    onUpdateAmount: (input) => {
      updateAmount({ input });
    },
  });

  useEffect(() => {
    console.log("adding user_id to trx", user_id);
    console.log("adding solanaPubKey to trx", solanaPubKey);
    console.log("Full userWalletData state:", {
      user_id,
      solanaPubKey,
      evmPubKey,
    });
    if (solanaPubKey) {
      dispatch(updateUserId(user_id));
      dispatch(updateInputPublicKey(solanaPubKey));
      dispatch(updateOutputPublicKey(solanaPubKey));
    } else {
      console.warn("solanaPubKey is not available in the Redux store");
    }
  }, [user_id, solanaPubKey]);

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
        onOpenChange={(isOpen) => {
          dispatch(toggleModal({ isOpen: isOpen }));
          if (!isOpen) {
            dispatch(unmount(undefined));
          }
        }}
        title="Swap"
        height={height}
        zIndex={zIndex}
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
            <NumberPad {...numberPadProps} />
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
              onPress={() => {
                dispatch(toggleOverlay({ type: "confirmSwap", isOpen: true }));
              }}
            >
              Confirm
            </Button>
          </section>
        </div>
      </Modal>
      <ConfirmSwapOverlay zIndex={9999 + 1} />
      <SelectSwapAssetOverlay zIndex={9999 + 2} />
      <ProcessingTransactionOverlay zIndex={9999 + 3} />
    </>
  );
};

export default SwapModal;
