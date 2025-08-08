import { IconCardContext } from "./IconCardContext";
import IconCardInner from "./IconCardInner";
import { css } from "@emotion/react";

export interface IconCardContent {
  leftContent: {
    title: string;
    description?: string;
    align?: "start" | "center";
    titleFontSize?: string;
  };
  rightContent?: {
    title: string;
    description?: string;
    align?: "start" | "center";
    titleFontSize?: string;
  };
  icon?: "wallet" | "user" | string;
}

export interface IconCardProps extends IconCardContent {
  backgroundColor?: string;
  isHighlighted?: boolean;
}

const IconCard = ({
  leftContent,
  rightContent,
  backgroundColor = "var(--clr-surface-raised)",
  isHighlighted = false,
  icon,
}: IconCardProps) => {
  return (
    <IconCardContext value={{ leftContent, rightContent, icon }}>
      <div
        className="icon-card"
        css={css`
          display: block;
          container: icon-card / size;
          padding: var(--size-150);
          height: 4.25rem;
          border-radius: var(--border-radius-medium);
          background-color: ${backgroundColor};
          outline-offset: -2px;
          outline: 2px solid
            ${isHighlighted ? "var(--clr-primary)" : "transparent"};
        `}
      >
        <IconCardInner />
      </div>
    </IconCardContext>
  );
};
export default IconCard;
