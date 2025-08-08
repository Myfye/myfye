import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay, {
  LocalOverlayProps,
} from "@/shared/components/ui/overlay/Overlay";
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

const DepositOffChainPrivyOverlay = ({ ...restProps }: LocalOverlayProps) => {
  const { fundWallet } = useFundWallet();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.depositOffChain.overlays.privy.isOpen
  );

  const transaction = useAppSelector(
    (state) => state.depositOffChain.privyTransaction
  );

  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );

  // Get Solana price from assets slice
  const solanaPriceUSD = useSelector(
    (state: any) => state.assets.assets.sol.exchangeRateUSD
  );

  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );

  const handleNextButtonPress = async () => {
    // Check if Solana exchange rate is valid
    if (!solanaPriceUSD || solanaPriceUSD <= 0) {
      toast.error("Unable to get Solana price. Please try again.");
      return;
    }

    // Convert USD amount to SOL
    let solAmount = 0;
    if (solanaPriceUSD > 0) {
      solAmount = amount / solanaPriceUSD;
      console.log("Converted amount in SOL:", solAmount);
    } else {
      toast.error("Unable to get Solana price. Please try again.");
      return;
    }

    // Prompts user to fund their wallet with SOL on Solana's mainnet.
    fundWallet(solanaPubKey, {
      cluster: { name: "mainnet-beta" },
      amount: solAmount.toString(), // Amount in SOL
      defaultFundingMethod: "card",
      asset: "USDC",
    });
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
              <Button expand>Next</Button>
            </section>
          </div>
        </div>
      </Overlay>
    </>
  );
};

export default DepositOffChainPrivyOverlay;
