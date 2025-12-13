import { css } from "@emotion/react";

import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay, unmount } from "../stores/sendSlice";
import SendSummary from "./SendSummary";
import { useSolanaWallets } from "@privy-io/react-auth";
import { tokenTransfer } from "@/functions/Transaction";
import toast from "react-hot-toast/headless";
import { updateBalance } from "../../assets/stores/assetsSlice";

const SendConfirmTransactionOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.send.overlays.confirmTransaction.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleOverlay({ type: "confirmTransaction", isOpen }));
  };

  const transaction = useSelector((state: RootState) => state.send.transaction);
  const assets = useSelector((state: RootState) => state.assets);

  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];

  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );

  const privyUserId = useSelector(
    (state: any) => state.userWalletData.privyUserId
  );

  const handleTransactionSubmit = async () => {
    if (!transaction.amount) return;
    if (!transaction.user) return;
    if (!transaction.assetId) return;

    // toggle overlay
    dispatch(toggleOverlay({ type: "processingTransaction", isOpen: true }));

    // next, go through transaction

    const sellAsset = assets.assets[transaction.assetId];
    if (!sellAsset) return;

    // Calculate the total balance in USD for the selected asset
    const totalBalance = sellAsset.balance * sellAsset.exchangeRateUSD;

    // Fix: Ensure sendAmount is capped at the totalBalance
    const sendAmount =
      transaction.amount > totalBalance ? totalBalance : transaction.amount;

    const sendAmountMicro = sendAmount * Math.pow(10, sellAsset.decimals);

    console.log("sendAmount", sendAmount);
    console.log("transaction:", transaction);
    console.log("solanaPubKey:", solanaPubKey);
    console.log(
      "transaction.user.solana_pub_key:",
      transaction.user.solana_pub_key
    );
    console.log("transaction.amount:", transaction.amount);
    console.log("wallet:", wallet);
    console.log("totalBalance:", totalBalance); // Add this log to verify the total balance

    const result = await tokenTransfer(
      solanaPubKey,
      transaction.user.solana_pub_key,
      sendAmountMicro, // Use sendAmount instead of transaction.amount
      transaction.assetId,
      wallet,
      privyUserId
    );

    if (result.success) {
      console.log("Transaction successful:", result.transactionId);
      dispatch(unmount());
      toast.success(
        `Sent $${transaction.formattedAmount} to ${
          transaction.user?.first_name ?? "user"
        }`
      );
      // TODO save transaction to db

      // TODO update user balance
      const currentBalance = sellAsset.balance;
      const newBalance = currentBalance - sendAmount;
      dispatch(
        updateBalance({
          assetId: transaction.assetId,
          balance: newBalance,
        })
      );
    } else {
      console.error("Transaction failed:", result.error);
      toast.error(`Error sending money. Please try again`);
    }
  };

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Confirm Send"
        zIndex={zIndex}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
          `}
        >
          <section
            css={css`
              margin-block-start: var(--size-300);
              margin-inline: var(--size-250);
            `}
          >
            <SendSummary />
          </section>
          <section
            css={css`
              margin-inline: var(--size-250);
              margin-block-start: var(--size-400);
            `}
          >
            <ul
              css={css`
                width: 100%;
                color: var(--clr-text);
                line-height: var(--line-height-tight);
                > * + * {
                  margin-block-start: var(--size-200);
                }
              `}
            >
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">Fee</span>
                <span
                  css={css`
                    font-size: var(--fs-medium);
                    color: var(--clr-text);
                  `}
                >
                  {transaction.fee
                    ? new Intl.NumberFormat("en-EN", {
                        style: "currency",
                        currency: "usd",
                      }).format(transaction.fee)
                    : "$0"}
                </span>
              </li>
            </ul>
          </section>
          <section
            css={css`
              margin-block-start: auto;
              margin-bottom: var(--size-250);
              margin-inline: var(--size-250);
            `}
          >
            <menu
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--control-gap-medium);
              `}
            >
              <li>
                <Button
                  expand
                  color="neutral"
                  onPress={() =>
                    void dispatch(
                      toggleOverlay({
                        type: "confirmTransaction",
                        isOpen: false,
                      })
                    )
                  }
                >
                  Cancel
                </Button>
              </li>
              <li>
                <Button expand onPress={handleTransactionSubmit}>
                  Send
                </Button>
              </li>
            </menu>
          </section>
        </div>
      </Overlay>
    </>
  );
};

export default SendConfirmTransactionOverlay;
