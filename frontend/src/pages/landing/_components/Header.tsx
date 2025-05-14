import { css } from "@emotion/react";
import { ReactNode } from "react";

const Header = ({ children }: { children?: ReactNode }) => {
  return (
    <header
      css={css`
        align-content: center;
        width: min(100% - 2 * var(--size-800), 87.5rem);
        margin-inline: auto;
      `}
    >
      {children}
    </header>
  );
};

export default Header;
