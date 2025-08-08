import { useContext } from "react";
import { IconCardContext } from "./IconCardContext";
import { css } from "@emotion/react";
import WalletIcon from "../icons/WalletIcon";
import AssetIcon from "../icons/AssetIcon";
import UserIcon from "../icons/UserIcon";
import IconCardTextContent from "./IconCardTextContent";

const IconCardInner = () => {
  const iconCardProps = useContext(IconCardContext);
  if (!iconCardProps) throw new Error("Context not found");
  const { icon, leftContent, rightContent } = iconCardProps;
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: auto 1fr auto;
        height: 100cqh;
      `}
    >
      <div
        className="icon-card-icon"
        css={css`
          display: grid;
          grid-template-columns: auto 1fr auto;
          height: 100cqh;
        `}
      >
        {icon === "wallet" && <WalletIcon />}
        {icon === "user" && <UserIcon />}
        {icon !== "wallet" && icon !== "user" && (
          <AssetIcon src={icon} alt="" />
        )}
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
          description={leftContent.description}
          titleFontSize={leftContent.titleFontSize}
          align={leftContent.align}
        />
        {rightContent && (
          <IconCardTextContent
            title={rightContent.title}
            description={rightContent.description}
            titleFontSize={leftContent.titleFontSize}
            align={leftContent.align}
          />
        )}
      </div>
    </div>
  );
};

export default IconCardInner;
