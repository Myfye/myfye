import { css } from "@emotion/react";
import { CSSProperties, ReactNode } from "react";

type Props = {
  backgroundColor?: string;
  children?: ReactNode;
  overflowX?: CSSProperties["overflowX"];
  overflowY?: CSSProperties["overflowX"];
};

const AppPage = ({
  backgroundColor = "var(--clr-surface)",
  overflowX,
  overflowY = "auto",
  children,
}: Props) => {
  return (
    <div
      className="app-page | no-scrollbar"
      css={css`
        height: 100cqh;
        background-color: ${backgroundColor};
        margin-inline: auto;
        overflow-x: ${overflowX};
        overflow-y: ${overflowY};
      `}
    >
      {children}
    </div>
  );
};

export default AppPage;
