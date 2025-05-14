import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMemo } from "react";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";
import { useLottie } from "lottie-react";
import { unmountOverlays, toggleOverlay, unmount } from "./paySlice";
import { PayTransactionStatus } from "./types";
import toast from "react-hot-toast/headless";

const ProcessingTransactionOverlay = ({ zIndex = 1000 }) => {
  const isOpen = useSelector(
    (state: RootState) => {
      const isOpen = state.pay.overlays.processingTransaction.isOpen;
      console.log('ProcessingTransactionOverlay selector, isOpen:', isOpen);
      return isOpen;
    }
  );
  
  console.log('ProcessingTransactionOverlay render, isOpen:', isOpen);
  
  const handleOpen = (isOpen: boolean) => {
    console.log('Pay processing transaction overlay handleOpen called with:', isOpen);
    dispatch(toggleOverlay({ type: "processingTransaction", isOpen }));
  };

  const dispatch = useDispatch();
  const transaction = useSelector((state: RootState) => state.pay.transaction);

  return (
    <HeadlessOverlay 
      isOpen={isOpen} 
      onOpenChange={handleOpen} 
      zIndex={zIndex}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100dvh;
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
                  margin-block-end: var(--size-200);
                `}
              >
                Sending...
              </h1>
              <button
                css={css`
                  text-align: center;
                  width: 100%;
                `}
                onClick={() => {
                  dispatch(unmountOverlays(undefined));
                }}
              >
                Click to toast
              </button>
            </hgroup>
          </section>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

const UIAnimation = ({
  transactionStatus,
}: {
  transactionStatus: PayTransactionStatus;
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

export default ProcessingTransactionOverlay;