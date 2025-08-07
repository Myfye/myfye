import { useAppDispatch } from "@/redux/hooks";
import Button from "@/shared/components/ui/button/Button";
import { css } from "@emotion/react";
import { Bank, Plus } from "@phosphor-icons/react";
import { toggleOverlay } from "../withdrawOffChainSlice";

const NoBankScreen = () => {
  const dispatch = useAppDispatch();
  return (
    <div
      css={css`
        height: 100cqh;
        align-content: center;
      `}
    >
      <div
        css={css`
          display: grid;
          place-items: center;
          width: 8rem;
          aspect-ratio: 1;
          border-radius: var(--border-radius-circle);
          background-color: var(--clr-green-200);
          margin-inline: auto;
        `}
      >
        <Bank
          width={80}
          height={80}
          color="var(--clr-green-700)"
          weight="light"
        />
      </div>
      <div>
        <h2
          className="heading-large"
          css={css`
            margin-block-start: var(--size-300);
            text-align: center;
          `}
        >
          No bank accounts found.
        </h2>
        <p
          className="caption"
          css={css`
            margin-block-start: var(--size-100);
            text-align: center;
            color: var(--clr-text-weak);
          `}
        >
          Get started by linking a bank account.
        </p>
        <div
          css={css`
            display: grid;
            place-items: center;
            margin-block-start: var(--size-200);
          `}
        >
          <Button
            icon={Plus}
            variant="ghost"
            onPress={() => {
              dispatch(toggleOverlay({ type: "bankPicker", isOpen: true }));
            }}
          >
            Add a bank account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoBankScreen;
