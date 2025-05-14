import { css } from "@emotion/react";
import { ReactNode } from "react";

const Main = ({ children }: { children: ReactNode }) => {
  return (
    <main
      css={css`
        width: min(100% - 2 * var(--size-800), 87.5rem);
        margin-inline: auto;
      `}
    >
      {children}
    </main>
  );
};

export default Main;
