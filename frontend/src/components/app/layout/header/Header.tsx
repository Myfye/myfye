/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Header = ({ children, color = "transparent" }) => {
  return (
    <header
      css={css`
        height: var(--size-600);
        background-color: ${color};
        position: relative;
        width: 100%;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding-inline: 0.625rem;
        `}
      >
        {children}
      </div>
    </header>
  );
};

export default Header;
