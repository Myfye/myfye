import { css } from "@emotion/react";
import { ReactNode } from "react";

const Header = ({
  children,
  color = "transparent",
}: {
  children: ReactNode;
  color: string;
}) => {
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
          padding-inline: 0.375rem;
        `}
      >
        {children}
      </div>
    </header>
  );
};

export default Header;
