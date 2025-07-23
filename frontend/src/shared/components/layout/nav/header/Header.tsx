import { css } from "@emotion/react";
import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
  color?: string;
}

const Header = ({ children, color = "transparent" }: HeaderProps) => {
  return (
    <header
      css={css`
        height: var(--size-600);
        background-color: ${color};
        position: sticky;
        top: 0;
        width: 100%;
        z-index: 1;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding-inline: calc(var(--size-250) - 0.25rem);
        `}
      >
        {children}
      </div>
    </header>
  );
};

export default Header;
