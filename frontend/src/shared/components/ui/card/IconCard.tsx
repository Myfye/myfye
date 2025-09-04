import { IconCardContext } from "./IconCardContext";
import IconCardInner from "./IconCardInner";
import { css } from "@emotion/react";
import { CaretRightIcon, Icon, PlusIcon } from "@phosphor-icons/react";
import { ButtonProps } from "../button/button.types";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

interface Content {
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  titleSize?: "medium" | "large";
  titleWeight?: string;
  subtitleSize?: "medium" | "small";
  textAlign?: string;
}
export interface IconCardContent {
  leftContent: Content;
  rightContent?: Content;
  icon:
    | "wallet"
    | "user"
    | "BRFlag"
    | "USFlag"
    | "MXFlag"
    | "bank_neutral"
    | string
    | Icon;
  action?: {
    id: string;
    label: string;
    icon: Icon;
    props: ButtonProps;
  };
}

export interface IconCardProps extends IconCardContent {
  backgroundColor?: string;
  isActive?: boolean;
  padding?: string;
  height?: string;
  showArrow?: boolean;
  showPlus?: boolean;
}

const IconCard = ({
  leftContent,
  rightContent,
  backgroundColor = "var(--clr-surface-raised)",
  icon,
  padding = "var(--size-150)",
  action,
  isActive = false,
  showArrow = false,
  showPlus = false,
  height = "4.25rem",
}: IconCardProps) => {
  return (
    <IconCardContext value={{ leftContent, rightContent, icon, action }}>
      <div
        className="icon-card"
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          container: icon-card / size;
          padding: ${padding};
          height: ${height};
          border-radius: var(--border-radius-medium);
          background-color: ${backgroundColor};
        `}
      >
        <IconCardInner />
        <div
          css={css`
            display: flex;
            align-items: center;
            margin-inline-end: var(--size-050);
            margin-inline-start: var(--size-150);
          `}
        >
          {isActive && <CheckIcon color="var(--clr-primary)" size={20} />}
          {showArrow && <CaretRightIcon color="var(--clr-icon)" size={20} />}
          {showPlus && (
            <div
              className="button"
              data-variant="primary"
              data-size="medium"
              data-expand="false"
              data-icon-only="true"
              data-loading="false"
              data-color="neutral"
            >
              <PlusIcon size={20} />
            </div>
          )}
        </div>
      </div>
    </IconCardContext>
  );
};
export default IconCard;
