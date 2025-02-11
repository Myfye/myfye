/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Footer = ({ children }) => {
  return (
    <footer
      css={css`
        border-top: 1px solid var(--clr-border-divider);
      `}
    >
      <div
        css={css`
          align-content: center;
          padding: 0 var(--size-250);
          height: 100%;
        `}
      >
        {children}
      </div>
    </footer>
  );
};

export default Footer;
