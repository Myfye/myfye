import { css } from "@emotion/react";
import ondoFinanceIcon from "@/assets/icons/ondo_finance.svg";

const CTACard = ({ title, subtitle, icon }) => {
  return (
    <div
      className="cta-card"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--size-150);
        padding: var(--size-200);
        width: calc(100% - var(--size-500));
        border-radius: var(--border-radius-medium);
        align-content: center;
        background-color: var(--clr-surface-raised);
        user-select: none;
      `}
    >
      <div
        className="icon-wrapper"
        css={css`
          width: 2.75rem;
          aspect-ratio: 1;
          border-radius: var(--border-radius-circle);
          overflow: hidden;
        `}
      >
        <img
          src={ondoFinanceIcon}
          alt="Ondo finance"
          css={css`
            width: 100%;
            height: 100%;
            object-fit: cover;
          `}
        />
      </div>
      <div
        className="content"
        css={css`
          align-content: center;
        `}
      >
        <p
          className="heading-small"
          css={css`
            color: var(--clr-text);
          `}
        >
          {title}
        </p>
        <p
          className="caption-small"
          css={css`
            color: var(--clr-text-weaker);
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
