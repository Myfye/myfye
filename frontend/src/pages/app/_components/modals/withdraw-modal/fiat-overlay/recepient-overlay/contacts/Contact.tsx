/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Contact = ({ name = "", walletAddress = "" }) => {
  return (
    <button
      className="contact"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--size-100);
      `}
    >
      <div
        className="avatar-wrapper | aspect-ratio-square"
        css={css`
          width: var(--size-500);
          border-radius: var(--border-radius-circle);
          background-color: var(--clr-surface-lowered);
        `}
      >
        <img src="" alt=""></img>
      </div>
      <div
        className="content"
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          line-height: var(--line-height-tight);
        `}
      >
        <p
          className="name"
          css={css`
            font-size: var(--fs-medium);
            font-weight: var(--fw-heading);
            color: var(--clr-text);
          `}
        >
          {name}
        </p>
        <p
          className="wallet-address"
          css={css`
            font-size: var(--fs-small);
            color: var(--clr-text-weaker);
            max-width: 10ch;
            overflow: hidden;
            white-space: nowrap;
          `}
        >
          {walletAddress}
        </p>
      </div>
    </button>
  );
};

export default Contact;
