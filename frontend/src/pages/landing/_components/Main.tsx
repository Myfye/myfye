import { css } from "@emotion/react";

const Main = ({ children }) => {
  return (
    <main
      css={css`
        width: min(100% - 2 * var(--size-250), 77.5rem);
        margin-inline: auto;
      `}
    >
      {children}
    </main>
  );
};

export default Main;
