import NumberPad from "@/shared/components/ui/number-pad/NumberPad";

import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import {
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
  updateTransactionType,
} from "@/features/pay/paySlice";
import PayController from "@/features/pay/PayController";
import PaySelectUserOverlay from "@/features/pay/PaySelectUserOverlay";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import PaySelectAssetOverlay from "@/features/pay/PaySelectAssetOverlay";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import PayConfirmTransactionOverlay from "@/features/pay/PayConfirmTransactionOverlay";
import ProcessingTransactionOverlay from "@/features/pay/ProcessingTransactionOverlay";
import { useAppSelector } from "@/redux/hooks";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";

const Pay = () => {
  const dispatch = useDispatch();

  const transaction = useAppSelector((state) => state.pay.transaction);
  const assets = useAppSelector((state) => state.assets);

  const numberPadProps = useNumberPad({
    onStartDelete: (input) => {
      dispatch(updateAmount({ input }));
    },
    onUpdateAmount: (input) => {
      dispatch(updateAmount({ input }));
    },
    onUpdatePresetAmount: (presetAmount) => {
      dispatch(updatePresetAmount(presetAmount));
    },
    formattedAmount: transaction.formattedAmount,
  });

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
      <div
        className="pay"
        css={css`
          height: 100cqh;
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr auto;
            gap: var(--size-200);
            height: 100%;
            padding-block-end: var(--size-200);
          `}
        >
          <div>
            <PayController />
          </div>
          <div
            css={css`
              display: grid;
              grid-template-rows: auto auto;
              gap: var(--size-200);
            `}
          >
            <section
              css={css`
                padding-inline: var(--size-250);
              `}
            >
              <NumberPad {...numberPadProps} />
            </section>
            <section
              css={css`
                padding-inline: var(--size-250);
              `}
            >
              <ButtonGroup
                scroll={false}
                direction="horizontal"
                size="medium"
                expand
              >
                <ButtonGroupItem
                  onPress={() => {
                    dispatch(updateTransactionType("request"));
                    dispatch(
                      toggleOverlay({ type: "selectUser", isOpen: true })
                    );
                  }}
                  isDisabled={isInvalidSwapTransaction}
                >
                  Request
                </ButtonGroupItem>
                <ButtonGroupItem
                  onPress={() => {
                    dispatch(updateTransactionType("send"));
                    dispatch(
                      toggleOverlay({ type: "selectUser", isOpen: true })
                    );
                  }}
                  isDisabled={isInvalidSwapTransaction}
                >
                  Pay
                </ButtonGroupItem>
              </ButtonGroup>
            </section>
          </div>
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
