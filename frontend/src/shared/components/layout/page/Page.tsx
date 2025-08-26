import { css } from "@emotion/react";
import { cn } from "cn-utility";
import { HTMLAttributes } from "react";

const Page = ({
  color = "var(--clr-surface)",
  ...restProps
}: HTMLAttributes<HTMLDivElement> & { color?: string }) => {
  return (
    <div
      {...restProps}
      className={cn("page", restProps.className)}
      css={css`
        max-width: var(--app-max-width);
        height: 100svh;
        container: page / size;
        background-color: ${color};
        margin-inline: auto;
      `}
    ></div>
  );
};

export default Page;
