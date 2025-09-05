import { css } from "@emotion/react";
import { ReactNode } from "react";

interface MainProps {
  children?: ReactNode;
}
const Main = ({ children }: MainProps) => {
  return (
    <main
      css={css`
        container: main / size;
        height: 100%;
      `}
    >
      {children}
    </main>
  );
};

export default Main;
