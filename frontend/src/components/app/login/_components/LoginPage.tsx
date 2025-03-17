/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const LoginPage = ({ children }) => {
  return (
    <div
      className="login-page | page"
      css={css`
        display: grid;
        grid-template-rows: 6rem 1fr auto;
        max-width: var(--app-max-width);
        margin-inline: auto;
      `}
    >
      {children}
    </div>
  );
};

export default LoginPage;
