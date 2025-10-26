import { css } from "@emotion/react";
import Heading from "./Heading";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
const AppPageHeading = ({ children }: Props) => {
  return (
    <div
      css={css`
        height: 2.25rem;
        align-content: center;
      `}
    >
      <Heading size="large" as="h1">
        {children}
      </Heading>
    </div>
  );
};

export default AppPageHeading;
