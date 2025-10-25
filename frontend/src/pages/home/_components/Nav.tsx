import { css } from "@emotion/react";
import { ReactNode } from "react";

interface NavProps {
  children: ReactNode;
}

const Nav = ({ children }: NavProps) => {
  return (
    <nav>
      <ul
        css={css`
          display: flex;
          gap: var(--size-300);
        `}
      >
        {children}
      </ul>
    </nav>
  );
};

export default Nav;
