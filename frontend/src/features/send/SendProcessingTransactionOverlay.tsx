import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useState } from "react";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";
import { useLottie } from "lottie-react";
import toast from "react-hot-toast/headless";
import { SendTransactionStatus } from "./types";
import { toggleModal, unmountOverlays } from "./sendSlice";
import { toggleOverlay, unmount } from "./sendSlice";
import { ProgressBar } from "react-aria-components";

const SendProcessingTransactionOverlay = ({ zIndex = 1000 }) => {
  const isOpen = useSelector(
    (state: RootState) => state.send.overlays.processingTransaction.isOpen
  );
  const handleOpen = (isOpen: boolean) => {
    toggleOverlay({ type: "processingTransaction", isOpen });
  };

  const dispatch = useDispatch();
  const transaction = useSelector((state: RootState) => state.send.transaction);

  const handleSuccess = () => {
    console.log("Success");
    toast.success("$65.32 sent to Phil");
    dispatch(unmount());
  };

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

  return (
    <HeadlessOverlay
      isOpen={isOpen}
      onOpenChange={handleOpen}
      zIndex={zIndex}
      onExitComplete={() => {
        handleSuccess();
      }}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100vh;
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
                Sending...
              </h1>
            </hgroup>
            <div
              css={css`
                margin-block-start: var(--size-400);
                width: 80%;
                margin-inline: auto;
              `}
            >
              <ProgressBar value={value} />
            </div>
          </section>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

const UIAnimation = ({
  transactionStatus,
}: {
  transactionStatus: SendTransactionStatus;
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

export default SendProcessingTransactionOverlay;
