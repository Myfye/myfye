import { css } from "@emotion/react";

interface BankCardProps {
  icon?: string;
  name: string;
  onPress: () => void;
}

const BankCard = ({ icon, name, onPress }: BankCardProps) => {
  return (
    <button onClick={onPress}>
      <div
        css={css`
          display: grid;
          place-items: center;
          padding: var(--size-200);
          border-radius: var(--border-radius-medium);
          background-color: var(--clr-surface-raised);
          cursor: pointer;
          transition: all 0.2s ease;
        `}
      >
        {icon && (
          <img
            src={icon}
            alt=""
            css={css`
              width: var(--size-700);
              aspect-ratio: 1;
              object-fit: cover;
              border-radius: var(--border-radius-small);
            `}
          />
        )}
        <span
          className="heading-small"
          css={css`
            margin-block-start: var(--size-200);
          `}
        >
          {name}
        </span>
      </div>
    </button>
  );
};

export default BankCard;
