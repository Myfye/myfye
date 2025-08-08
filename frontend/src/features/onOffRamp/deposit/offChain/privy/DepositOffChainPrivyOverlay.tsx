import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import { useFundWallet } from "@privy-io/react-auth/solana";
import {
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
} from "../depositOffChainSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import AmountDisplay from "@/shared/components/ui/amount-display/AmountDisplay";
import toast from "react-hot-toast/headless";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";

const DepositOffChainPrivyOverlay = () => {
  const { fundWallet } = useFundWallet();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.depositOffChain.overlays.privy.isOpen
  );

  const transaction = useAppSelector(
    (state) => state.depositOffChain.privyTransaction
  );

  // Get Solana price from assets slice
  const solanaPriceUSD = useAppSelector(
    (state) => state.assets.assets.sol.exchangeRateUSD
  );

  const solanaPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );

  const handleNextPress = async () => {
    if (!transaction.amount) throw new Error("Invalid Amount");
    if (!solanaPriceUSD || solanaPriceUSD <= 0) {
      toast.error("Unable to get Solana price. Please try again.");
      return;
    }

    const solAmount = transaction.amount / solanaPriceUSD;

    await fundWallet(solanaPubKey, {
      cluster: { name: "mainnet-beta" },
      amount: solAmount.toString(),
      defaultFundingMethod: "card",
    });
    toggleOverlay({ type: "privy", isOpen: false });
  };

  const numberPadProps = useNumberPad({
    onStartDelete: (input) => {
      dispatch(updateAmount({ input, transactionType: "privy" }));
    },
    onUpdateAmount: (input) => {
      dispatch(updateAmount({ input, transactionType: "privy" }));
    },
    onUpdatePresetAmount: (presetAmount) => {
      dispatch(updatePresetAmount({ presetAmount, transactionType: "privy" }));
    },
  });

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "privy", isOpen }));
        }}
        title="Deposit With Card"
        zIndex={2001}
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
          <section>
            <AmountDisplay
              amount={transaction.formattedAmount}
              fiatCurrency="usd"
            />
          </section>
          <div>
            <section
              css={css`
                padding-inline: var(--size-250);
                margin-block-end: var(--size-200);
              `}
            >
              <NumberPad {...numberPadProps} />
            </section>
            <section
              css={css`
                padding-inline: var(--size-250);
              `}
            >
              <Button expand onPress={handleNextPress}>
                Next
              </Button>
            </section>
          </div>
        </div>
      </Overlay>
    </>
  );
};

export default DepositOffChainPrivyOverlay;
