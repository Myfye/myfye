/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Header = ({ children }) => {
  return (
    <header>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding-inline: var(--size-100);
        `}
      >
        {children}
      </div>
    </header>
  );
};

export default Header;
