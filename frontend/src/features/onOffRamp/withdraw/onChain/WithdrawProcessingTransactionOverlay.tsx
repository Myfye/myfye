import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import { useMemo } from "react";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";
import { useLottie } from "lottie-react";

interface WithdrawProcessingTransactionOverlayProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  status: "idle" | "success" | "fail";
  onClose: () => void;
}

const WithdrawProcessingTransactionOverlay = ({
  isOpen,
  onOpenChange,
  status,
  onClose
}: WithdrawProcessingTransactionOverlayProps) => {
  return (
    <HeadlessOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100dvh;
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
            <UIAnimation status={status} />
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
                {status === "idle" && "Processing..."}
                {status === "success" && "Success!"}
                {status === "fail" && "Failed"}
              </h1>
              {status !== "idle" && (
                <button
                  css={css`
                    text-align: center;
                    width: 100%;
                  `}
                  onClick={onClose}
                >
                  Close
                </button>
              )}
            </hgroup>
          </section>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

const UIAnimation = ({
  status,
}: {
  status: "idle" | "success" | "fail";
}) => {
  const options = useMemo(() => {
    switch (status) {
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
  }, [status]);

  const { View } = useLottie(options);

  return <>{View}</>;
};

export default WithdrawProcessingTransactionOverlay; 