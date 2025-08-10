import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Button from "@/shared/components/ui/button/Button";
import { useAppDispatch } from "@/redux/hooks";
import { toggleOverlay, unmountOverlays } from "./withdrawOnChainSlice";
import { toggleModal as toggleWithdrawModal } from "../withdrawSlice";
import Ring180Loader from "@/shared/components/ui/loading/spinners/180RingLoader";

interface WithdrawProcessingTransactionOverlayProps extends OverlayProps {}

const WithdrawProcessingTransactionOverlay = ({
  isOpen,
  onOpenChange,
}: WithdrawProcessingTransactionOverlayProps) => {
  const dispatch = useAppDispatch();
  const transaction = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction
  );

  const handleClose = () => {
    dispatch(toggleOverlay({ type: "processingTransaction", isOpen: false }));
    dispatch(toggleWithdrawModal(false));
    dispatch(unmountOverlays());
  };
  return (
    <HeadlessOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100svh;
        `}
      >
        <section>
          <div
            css={css`
              width: 12rem;
              aspect-ratio: 1;
              margin-inline: auto;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            {transaction.status === "idle" && (
              <Ring180Loader width={80} height={80} fill="var(--clr-primary)" />
            )}
            {transaction.status === "success" && (
              <div
                css={css`
                  font-size: 4rem;
                  color: var(--clr-success);
                `}
              >
                ✓
              </div>
            )}
            {transaction.status === "fail" && (
              <div
                css={css`
                  font-size: 4rem;
                  color: var(--clr-error);
                `}
              >
                ✗
              </div>
            )}
          </div>
          <section>
            <hgroup>
              <h1
                className="heading-x-large"
                css={css`
                  color: var(--clr-text);
                  text-align: center;
                  margin-block-end: var(--size-200);
                `}
              >
                {transaction.status === "idle" && "Processing Transaction..."}
                {transaction.status === "success" && "Transaction Successful!"}
                {transaction.status === "fail" && "Transaction Failed"}
              </h1>
              <p
                css={css`
                  color: var(--clr-text-secondary);
                  text-align: center;
                  margin-block-end: var(--size-300);
                `}
              >
                {transaction.status === "idle" && "Please wait while we process your withdrawal"}
                {transaction.status === "success" && "Your funds have been sent successfully"}
                {transaction.status === "fail" && "There was an error processing your transaction"}
              </p>
              {transaction.status !== "idle" && (
                <Button onPress={handleClose}>Close</Button>
              )}
            </hgroup>
          </section>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

export default WithdrawProcessingTransactionOverlay;
