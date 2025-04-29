import { css } from "@emotion/react";

const CardSkeleton = () => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--size-150);
        height: 4.25rem;
        align-items: center;
      `}
    >
      <div
        className="aspect-ratio-square skeleton-shimmer"
        css={css`
          width: 2.75rem;
          background-color: var(--clr-surface-lowered);
          border-radius: var(--border-radius-circle);
        `}
      ></div>
      <div
        className="skeleton-shimmer"
        css={css`
          background-color: var(--clr-surface-lowered);
          border-radius: var(--border-radius-medium);
          height: 100%;
        `}
      ></div>
    </div>
  );
};

export default CardSkeleton;
