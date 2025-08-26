import { css } from "@emotion/react";
import Button from "../button/Button";
import TransactionProcessStatus, {
  TransactionStatus,
} from "./TransactionProcessStatus";
import ProgressBar from "../progress_bar/ProgressBar";
import { useEffect, useState } from "react";

interface TransactionProcessScreenProps {
  onClose?: () => void;
  status: TransactionStatus;
  title: string;
  subtitle?: string;
}
const TransactionProcessScreen = ({
  onClose,
  status,
  title,
  subtitle,
}: TransactionProcessScreenProps) => {
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
  }, []);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100cqh;
        background: var(--clr-surface);
        position: relative;
      `}
    >
      <section
        css={css`
          padding-inline: var(--size-400);
        `}
      >
        <div
          css={css`
            width: 12rem;
            aspect-ratio: 1;
            margin-inline: auto;
          `}
        >
          <TransactionProcessStatus transactionStatus={status} />
        </div>
        <div>
          <h1
            className="heading-x-large"
            css={css`
              color: var(--clr-text);
              text-align: center;
            `}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="caption"
              css={css`
                margin-block-start: var(--size-150);
                color: var(--clr-text-weaker);
                text-align: center;
                max-width: 65ch;
              `}
            >
              {subtitle}
            </p>
          )}
        </div>
        {/* Progress bar temporarily disabled for testing */}
        {/* {status === "idle" && (
          <div
            css={css`
              margin-block-start: var(--size-400);
              width: 80%;
              margin-inline: auto;
            `}
          >
            <ProgressBar value={value} />
          </div>
        )} */}
      </section>
      <section
        css={css`
          width: 100%;
          position: absolute;
          bottom: var(--size-250);
          padding-inline: var(--size-400);
        `}
      >
        <Button
          expand
          isDisabled={status === "signed" || status === "idle"}
          onPress={onClose}
        >
          Done
        </Button>
      </section>
    </div>
  );
};

export default TransactionProcessScreen;
