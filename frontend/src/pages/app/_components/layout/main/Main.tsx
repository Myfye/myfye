/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Main = ({ children }) => {
  return (
    <main
      css={css`
        overflow-y: auto;
        container: main / size;
        height: 100%;
      `}
    >
      {children}
    </main>
  );
};

export default Main;
