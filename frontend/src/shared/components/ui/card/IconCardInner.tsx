import { useContext } from "react";
import { IconCardContext } from "./IconCardContext";
import { css } from "@emotion/react";
import WalletIcon from "../icons/WalletIcon";
import UserIcon from "../icons/UserIcon";
import IconCardTextContent from "./IconCardTextContent";
import FlagIcon from "../icons/FlagIcon";
import Button from "../button/Button";
import AssetIcon from "../icons/AssetIcon";
import BankIcon from "../icons/BankIcon";
import { getIconWrapperSize, IconSize } from "../icons/utils";
import { getIconSize } from "../button/utils";

export const getIcon = (icon: string, size: IconSize = "medium") => {
  switch (icon) {
    case "wallet": {
      return <WalletIcon size={size} />;
    }
    case "user": {
      return <UserIcon size={size} />;
    }
    case "BRFlag": {
      return <FlagIcon flag="BR" size={size} />;
    }
    case "MXFlag": {
      return <FlagIcon flag="MX" size={size} />;
    }
    case "USFlag": {
      return <FlagIcon flag="US" size={size} />;
    }
    case "bank": {
      return <BankIcon size={size} />;
    }
    case "bank_neutral": {
      return <BankIcon size={size} type="neutral" />;
    }
    default: {
      return <AssetIcon icon={icon} size={size} />;
    }
  }
};

const IconCardInner = () => {
  const iconCardProps = useContext(IconCardContext);
  if (!iconCardProps) throw new Error("Context not found");
  const { icon, leftContent, rightContent, action } = iconCardProps;
  const Icon = typeof icon !== "string" && icon;
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: auto 1fr auto;
        height: 100cqh;
        align-content: center;
      `}
    >
      <div
        className="icon-card-icon"
        css={css`
          align-content: center;
          margin-inline-end: var(--size-150);
        `}
      >
        {typeof icon === "string"
          ? getIcon(icon)
          : Icon && <Icon size={getIconSize("medium")} />}
      </div>
      <div
        className="icon-card-content"
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100cqh;
        `}
      >
        <IconCardTextContent
          title={leftContent.title}
          subtitle={leftContent.subtitle}
          titleSize={leftContent.titleSize}
          align={leftContent.align}
          titleWeight={leftContent.titleWeight}
          textAlign={leftContent.textAlign}
        />
        {rightContent && (
          <IconCardTextContent
            title={rightContent.title}
            subtitle={rightContent.subtitle}
            titleSize={rightContent.titleSize}
            align={rightContent.align}
            titleWeight={rightContent.titleWeight}
            textAlign={rightContent.textAlign}
          />
        )}
      </div>
      {action && (
        <div className="icon-card-action">
          <Button
            {...action.props}
            icon={action.icon}
            iconOnly
            color="transparent"
            aria-label={action.label}
          />
        </div>
      )}
    </div>
  );
};

export default IconCardInner;
