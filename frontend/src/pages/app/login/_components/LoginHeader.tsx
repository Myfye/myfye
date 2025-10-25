import { css } from "@emotion/react";

const LoginHeader = ({ children }) => {
  return (
    <header
      css={css`
        display: grid;
        place-items: center;
        width: 100%;
        align-content: center;
        padding: 0 var(--size-250);
      `}
    >
      {children}
    </header>
  );
};

export default LoginHeader;
