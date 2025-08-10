import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Button from "@/shared/components/ui/button/Button";
import { useAppDispatch } from "@/redux/hooks";
import { toggleOverlay, unmountOverlays } from "./withdrawOnChainSlice";
import { toggleModal as toggleWithdrawModal } from "../withdrawSlice";
import { useEffect, useMemo, useState } from "react";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";
import { useLottie } from "lottie-react";
import { ProgressBar } from "react-aria-components";

interface WithdrawProcessingTransactionOverlayProps extends OverlayProps {}

const WithdrawProcessingTransactionOverlay = ({
  isOpen,
  onOpenChange,
}: WithdrawProcessingTransactionOverlayProps) => {
  const dispatch = useAppDispatch();
  const transaction = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction
  );

  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((value) => (value += 5));
    }, 1000);
    if (value >= 100) return clearInterval(interval);
    return () => {
      clearInterval(interval);
      setValue(0);
    };
  });

  const handleClose = () => {
    dispatch(toggleOverlay({ type: "processingTransaction", isOpen: false }));
    dispatch(toggleWithdrawModal(false));
    dispatch(unmountOverlays());
  };
  return (
    <HeadlessOverlay isOpen={isOpen} onOpenChange={onOpenChange} zIndex={2004}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100svh;
          background: var(--clr-background);
        `}
      >
        <section css={css``}>
          <div
            css={css`
              width: 12rem;
              aspect-ratio: 1;
              margin-inline: auto;
            `}
          >
            <UIAnimation transactionStatus={transaction.status} />
          </div>
          <section>
            <hgroup>
              <h1
                className="heading-x-large"
                css={css`
                  color: var(--clr-text);
                  text-align: center;
                `}
              >
                {transaction.status === "idle" && "Processing..."}
                {transaction.status === "success" && "Success!"}
                {transaction.status === "fail" && "Failed"}
              </h1>
            </hgroup>
            {transaction.status === "idle" && (
              <div
                css={css`
                  margin-block-start: var(--size-400);
                  width: 80%;
                  margin-inline: auto;
                `}
              >
                <ProgressBar value={value} />
              </div>
            )}
            {transaction.status !== "idle" && (
              <div
                css={css`
                  margin-block-start: var(--size-400);
                  display: flex;
                  justify-content: center;
                `}
              >
                <Button onPress={handleClose}>Close</Button>
              </div>
            )}
          </section>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

const UIAnimation = ({
  transactionStatus,
}: {
  transactionStatus: "idle" | "success" | "fail";
}) => {
  const options = useMemo(() => {
    switch (transactionStatus) {
      case "success": {
        return {
          loop: false,
          animationData: success,
          autoplay: true,
        };
      }
      case "fail": {
        return {
          loop: false,
          animationData: fail,
          autoplay: true,
        };
      }
      default: {
        return {
          loop: true,
          animationData: leafLoading,
          autoplay: true,
        };
      }
    }
  }, [transactionStatus]);

  const { View } = useLottie(options);

  return <>{View}</>;
};

export default WithdrawProcessingTransactionOverlay;
