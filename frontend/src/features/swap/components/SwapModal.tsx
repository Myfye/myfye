import { useEffect, useMemo, useRef, useState } from "react";

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
} from "../stores/swapSlice";
import SwapController from "./SwapController";
import { RootState } from "@/redux/store";
import ConfirmSwapOverlay from "./ConfirmSwapOverlay";
import SelectSwapAssetOverlay from "./SelectSwapAssetOverlay";
import ProcessingTransactionOverlay from "./ProcessingTransactionOverlay";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";

// Check if current time is during weekend trading blackout
// Friday 5pm - Monday 5am (local time)
const isWeekendTradingBlackout = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, 5 = Friday, 6 = Saturday
  const hour = now.getHours();

  // Sunday (all day)
  if (day === 0) return true;
  // Saturday (all day)
  if (day === 6) return true;
  // Friday after 5pm (17-23)
  if (day === 5 && hour >= 17) return true;
  // Monday before 5am (0-4)
  if (day === 1 && hour < 5) return true;

  return false;
};

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
      dispatch(updateAmount({ input }));
    },
    onUpdateAmount: (input) => {
      dispatch(updateAmount({ input }));
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
    if (!transaction.sell.assetId || !transaction.buy.assetId) {
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

    // Find the specific asset ID that corresponds to the asset ID
    const sellAsset = assets.assets[transaction.sell.assetId];
    if (!sellAsset) return true;

    // Check the balance of the sell asset directly
    const totalBalance = sellAsset.balance;
    // Now check the balance using the specific asset ID
    if (totalBalance < transaction.sell.amount) return true;
    return false;
  };

  const isInvalidSwapTransaction = checkIfInvalidSwapTransaction();

  // Check if a commodity is selected (buy or sell)
  const hasCommoditySelected = useMemo(() => {
    const buyAsset = transaction.buy.assetId
      ? assets.assets[transaction.buy.assetId]
      : null;
    const sellAsset = transaction.sell.assetId
      ? assets.assets[transaction.sell.assetId]
      : null;
    return (
      buyAsset?.dashboardId === "commodities" ||
      sellAsset?.dashboardId === "commodities"
    );
  }, [transaction.buy.assetId, transaction.sell.assetId, assets.assets]);

  const isWeekend = useMemo(() => isWeekendTradingBlackout(), []);
  const showCommodityWarning = isWeekend && hasCommoditySelected;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleModal({ isOpen }));
        }}
        title="Swap"
        height={height}
        zIndex={zIndex}
        onExit={() => {
          dispatch(unmount());
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
          {showCommodityWarning && (
            <div
              css={css`
                background-color: var(--clr-warning-surface, #fef3c7);
                border: 1px solid var(--clr-warning-border, #f59e0b);
                border-radius: var(--border-radius-medium);
                padding: var(--size-150) var(--size-200);
                margin-inline: var(--size-200);
                margin-block-end: var(--size-150);
                display: flex;
                align-items: center;
                gap: var(--size-100);
              `}
            >
              <span
                css={css`
                  font-size: var(--fs-large);
                `}
              >
                ⚠️
              </span>
              <p
                css={css`
                  color: var(--clr-warning-text, #92400e);
                  font-size: var(--fs-small);
                  font-weight: var(--fw-active);
                  margin: 0;
                `}
              >
                Commodities markets are closed on weekends.
              </p>
            </div>
          )}
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
              Preview
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
