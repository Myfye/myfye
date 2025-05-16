import { css } from "@emotion/react";

const LoginMain = ({ children }) => {
  return (
    <main
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding: 0 var(--size-250);
      `}
    >
      {children}
    </main>
  );
};

export default LoginMain;
