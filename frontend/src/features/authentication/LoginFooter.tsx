import { css } from "@emotion/react";

const LoginFooter = ({ children }) => {
  return (
    <footer
      css={css`
        padding: var(--size-400) var(--size-250) var(--size-250) var(--size-250);
      `}
    >
      {children}
    </footer>
  );
};

export default LoginFooter;
