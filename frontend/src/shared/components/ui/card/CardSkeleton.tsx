import { css } from "@emotion/react";

const CardSkeleton = () => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--size-150);
        height: 4.25rem;
        align-items: flex-start;
        overflow: hidden;
      `}
    >
      <div
        className="aspect-ratio-square skeleton-shimmer"
        css={css`
          width: 2.75rem;
          background-color: var(--clr-surface-lowered);
          border-radius: var(--border-radius-circle);
          position: relative;
        `}
      ></div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          height: 100%;
          padding-block-start: var(--size-025);
        `}
      >
        <div>
          <div
            className="skeleton-shimmer"
            css={css`
              font-size: var(--fs-medium);
              background-color: var(--clr-surface-lowered);
              border-radius: var(--border-radius-small);
              height: calc(var(--fs-medium) * var(--line-height-tight));
              position: relative;
              width: 18ch;
            `}
          ></div>
          <div
            className="skeleton-shimmer"
            css={css`
              font-size: var(--fs-medium);
              width: 16ch;
              background-color: var(--clr-surface-lowered);
              border-radius: var(--border-radius-small);
              height: calc(var(--fs-medium) * var(--line-height-tight));
              margin-block-start: var(--size-050);
              position: relative;
            `}
          ></div>
        </div>
        <div
          className="skeleton-shimmer"
          css={css`
            font-size: var(--fs-medium);
            width: 6ch;
            background-color: var(--clr-surface-lowered);
            border-radius: var(--border-radius-small);
            height: calc(var(--fs-medium) * var(--line-height-tight));
            position: relative;
          `}
        ></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
