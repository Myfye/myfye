import { css } from "@emotion/react";

import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay, unmount, unmountOverlays } from "./paySlice";
import PaySummary from "./PaySummary";
import { tokenTransfer } from "@/functions/Transaction";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import toast from "react-hot-toast/headless";
import { savePayTransaction } from "./PaySaveTransaction";
import { logError } from "@/functions/logError";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../../env';

const PayConfirmTransactionOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.pay.overlays.confirmTransaction.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleOverlay({ type: "processingTransaction", isOpen }));
  };

  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];

  const currentUserID = useSelector((state: RootState) => state.userWalletData.currentUserID);

  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );

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

    console.log('Starting transaction submission...');
    
    if (!transaction.amount) return;
    if (!transaction.user) return;
    if (!transaction.abstractedAssetId) return;
    
    console.log('Opening processing overlay...');
    // First open the processing overlay
    dispatch(toggleOverlay({ type: "processingTransaction", isOpen: true }));
    console.log('Processing overlay dispatch completed');
    
    // Add a small delay to ensure state updates are processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Closing confirm overlay...');
    // Then close the confirm overlay
    dispatch(toggleOverlay({ type: "confirmTransaction", isOpen: false }));
   
    // next, go through transaction
    const sellAbstractedAsset =
      assets.abstractedAssets[transaction.abstractedAssetId];
      /*
    if (!sellAbstractedAsset) {
      // If we can't find the asset, close the processing overlay
      dispatch(toggleOverlay({ type: "processingTransaction", isOpen: false }));
      return;
    }*/
   
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
    const sendAmount =
      transaction.amount > totalBalance ? totalBalance : transaction.amount;
   
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
   
    try {
      const result = await tokenTransfer(
        solanaPubKey,
        transaction.user.solana_pub_key,
        sendAmountMicro,
        assetCode,
        wallet
      );
   
      if (result.success) {
        console.log("Transaction successful:", result.transactionId);
        
        // Save the transaction to the database
        try {
          await savePayTransaction(
            transaction,
            result.transactionId,
            wallet,
            currentUserID
          );
        } catch (error) {
          console.error("Failed to save transaction:", error);
          // Continue with the success flow even if saving fails
          logError("Failed to save transaction:", 'pay', error);
        }
   
   
        // Send an email to the user
        try {
          await sendPayReceiptEmail();
        } catch (error) {
          console.error("Failed to send email:", error);
          logError("Failed to send email:", 'pay', error);
        }
   
        // Close processing overlay and show success message
        dispatch(toggleOverlay({ type: "processingTransaction", isOpen: false }));
        dispatch(unmount());
        toast.success(
          `Sent $${transaction.formattedAmount} to ${
            transaction.user?.first_name ?? "user"
          }`
        );
      } else {
        console.error("Transaction failed:", result.error);
        // Close processing overlay and show error message
        dispatch(toggleOverlay({ type: "processingTransaction", isOpen: false }));
        logError("Transaction failed:", 'pay', result.error);
        toast.error(`Error sending money. Please try again`);
      }
    } catch (error) {
      console.error("Transaction error:", error);
      logError("Transaction error:", 'pay', error);
      // Close processing overlay and show error message
      dispatch(toggleOverlay({ type: "processingTransaction", isOpen: false }));
      toast.error(`Error sending money. Please try again`);
    }
  };

  const sendPayReceiptEmail = async () => {
    const name = 'Someone';
    const templateId = 'd-01416b6dc85446b7baf63c535e2950e8';
    const emailAddress = transaction.user.email;
    const amount = transaction.amount;

    console.log("Sending email to:", emailAddress);
    console.log("Amount to send:", amount);


    try {
      const response = await fetch(`${MYFYE_BACKEND}/send_email`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': MYFYE_BACKEND_KEY,
          },
          body: JSON.stringify({
            templateId: templateId,
            emailAddress: emailAddress,
            firstName: name,
            amount: amount
          })
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Backend error:", errorData);
          throw new Error(`Backend error: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
        console.error("Failed to send email:", error);
        logError("Failed to send email:", 'pay', error);
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
                


              </li>
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >

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
                  $0
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
