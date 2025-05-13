import { css } from "@emotion/react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch } from "react-redux";
import { toggleOverlay } from "../withdrawSlice";
import { ArrowLeft } from "@phosphor-icons/react";

interface WithdrawConfirmTransactionOverlayProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBack: () => void;
  selectedToken: string;
  amount: string;
  address: string;
  onConfirm: () => void;
}

const WithdrawConfirmTransactionOverlay = ({
  isOpen,
  onOpenChange,
  onBack,
  selectedToken,
  amount,
  address,
  onConfirm
}: WithdrawConfirmTransactionOverlayProps) => {
  const dispatch = useDispatch();

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Confirm Withdrawal"
      leftIcon={<ArrowLeft size={24} />}
      onLeftIconClick={onBack}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: var(--size-200);
        `}
      >
        <section
          css={css`
            margin-block-start: var(--size-300);
            margin-inline: var(--size-250);
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-200);
              background-color: var(--clr-surface-raised);
              box-shadow: var(--box-shadow-card);
              padding: var(--size-200);
              border-radius: var(--border-radius-medium);
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <span className="heading-small">Sending</span>
              <span
                css={css`
                  font-size: var(--fs-medium);
                  color: var(--clr-text);
                `}
              >
                {amount} {selectedToken}
              </span>
            </div>
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <span className="heading-small">To Address</span>
              <span
                css={css`
                  font-size: var(--fs-small);
                  color: var(--clr-text);
                  font-family: monospace;
                `}
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          </div>
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
                onPress={onBack}
              >
                Cancel
              </Button>
            </li>
            <li>
              <Button expand onPress={onConfirm}>
                Confirm
              </Button>
            </li>
          </menu>
        </section>
      </div>
    </Overlay>
  );
};

export default WithdrawConfirmTransactionOverlay; 