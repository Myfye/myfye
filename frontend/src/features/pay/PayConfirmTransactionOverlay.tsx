import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay } from "./paySlice";
import PaySummary from "./PaySummary";
import { tokenTransfer } from "@/functions/Transaction";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { KeyReturn } from "@phosphor-icons/react";




const PayConfirmTransactionOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.pay.overlays.confirmTransaction.isOpen
  );

  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleOverlay({ type: "confirmTransaction", isOpen }));
  };

  const solanaPubKey = useSelector((state: any) => state.userWalletData.solanaPubKey);

  const transaction = useSelector((state: RootState) => state.pay.transaction);

  const assets = useSelector((state: RootState) => state.assets);

  // const assets = useSelector((state: RootState) => state.assets);

  // const getAssetId = (abstractedAssetId: AbstractedAsset["id"] | null) => {
  //   switch (abstractedAssetId) {
  //     case "us_dollar_yield": {
  //       return "usdy_sol";
  //     }
  //     case "us_dollar": {
  //       return "usdc_sol";
  //     }
  //     case "sol": {
  //       return "sol";
  //     }
  //     case "btc": {
  //       return "btc_sol";
  //     }
  //     case "euro": {
  //       return "eurc_sol";
  //     }
  //     default: {
  //       throw new Error("Could not find abstracted Asset Id");
  //     }
  //   }
  // };

  const handleTransactionSubmit = async () => {
    const sellAbstractedAsset =
      assets.abstractedAssets[transaction.abstractedAssetId];
    if (!sellAbstractedAsset) return;

    // Get all assets associated with this abstracted asset
    const associatedAssets = sellAbstractedAsset.assetIds.map(
      (assetId) => assets.assets[assetId]
    );
    
    // Calculate the total balance in USD
    const totalBalance = associatedAssets.reduce(
      (total, asset) => total + asset.balance,
      0
    );
    
    // Fix: Ensure sendAmount is capped at the totalBalance
    const sendAmount = transaction.amount > totalBalance ? totalBalance : transaction.amount;

    const sendAmountMicro = sendAmount * 1000000;

    let assetCode = "";
    if (transaction.abstractedAssetId === "us_dollar_yield") {
      assetCode = "usdySol";
    } else if (transaction.abstractedAssetId === "us_dollar") {
      assetCode = "usdcSol";
    } else if (transaction.abstractedAssetId === "sol") {
      assetCode = "sol";
    } else if (transaction.abstractedAssetId === "euro") {
      assetCode = "eurcSol";
    } else if (transaction.abstractedAssetId === "btc") {
      assetCode = "btcSol";
    }

    console.log("sendAmount", sendAmount);
    console.log("transaction:", transaction);
    console.log("solanaPubKey:", solanaPubKey);
    console.log("transaction.user.solana_pub_key:", transaction.user.solana_pub_key);
    console.log("transaction.amount:", transaction.amount);
    console.log("assetCode", assetCode);
    console.log("wallet:", wallet);
    console.log("totalBalance:", totalBalance); // Add this log to verify the total balance

    dispatch(toggleOverlay({ type: "processingTransaction", isOpen: true }));

    const result = await tokenTransfer(
      solanaPubKey, 
      transaction.user.solana_pub_key, 
      sendAmountMicro, // Use sendAmount instead of transaction.amount
      assetCode, 
      wallet);

      if (result.success) {
        console.log("Transaction successful:", result.transactionId);
        // TODO save transaction to db

        // TODO update user balance 
        // TODO update suer interface
      } else {
        console.error("Transaction failed:", result.error);
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
            <PaySummary />
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
                <span className="heading-small">CBBTC contract</span>
                <span
                  css={css`
                    font-size: var(--fs-medium);
                    color: var(--clr-text);
                  `}
                >
                  0xcbb7...3bf
                </span>
              </li>
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">Slippage tolerance</span>{" "}
                <span
                  css={css`
                    font-size: var(--fs-medium);
                    color: var(--clr-text);
                  `}
                >
                  3%
                </span>
              </li>
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">Coinbase fee</span>{" "}
                <span
                  css={css`
                    font-size: var(--fs-medium);
                    color: var(--clr-text);
                  `}
                >
                  $0.02
                </span>
              </li>
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">Network fee</span>{" "}
                <span
                  css={css`
                    font-size: var(--fs-medium);
                    color: var(--clr-text);
                  `}
                >
                  $0.09 - $0.10
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
                  {transaction.type === "send" ? "Send" : "Request"}
                </Button>
              </li>
            </menu>
          </section>
        </div>
      </Overlay>
    </>
  );
};

export default PayConfirmTransactionOverlay;
