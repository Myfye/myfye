/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const CTACard = ({ title, subtitle, icon }) => {
  return (
    <div
      className="cta-card"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--size-150);
        padding: var(--size-300);
        width: calc(100% - var(--size-500));
        border-radius: var(--border-radius-medium);
        box-shadow: var(--box-shadow-card);
        align-content: center;
      `}
    >
      <div
        className="icon-wrapper"
        css={css`
          width: var(--size-500);
          aspect-ratio: 1;
          background-color: var(--clr-surface-lowered);
          border-radius: var(--border-radius-small);
        `}
      ></div>
      <div className="content">
        <p
          css={css`
            font-weight: var(--fw-active);
            color: var(--clr-text);
            font-size: var(--fs-small);
          `}
        >
          {title}
        </p>
        <p
          css={css`
            font-weight: var(--fw-active);
            font-size: var(--fs-x-small);
            color: var(--clr-text-neutral);
            margin-block-start: var(--size-050);
          `}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default CTACard;
