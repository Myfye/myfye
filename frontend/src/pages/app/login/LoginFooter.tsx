import { css } from "@emotion/react";
import { ReactNode } from "react";

const LoginFooter = ({ children }: { children: ReactNode }) => {
  return (
    <footer
      css={css`
        padding: var(--size-600) var(--size-250) var(--size-250) var(--size-250);
      `}
    >
      {children}
    </footer>
  );
};

export default LoginFooter;
