import { css } from "@emotion/react";
import IconWrapper from "./IconWrapper";
import { IconSize } from "./utils";

interface AssetIconProps {
  icon: string;
  size?: IconSize;
  label?: string;
}
const AssetIcon = ({ icon, label, size = "medium" }: AssetIconProps) => {
  if (!icon) throw new Error("No icon defined");
  return (
    <IconWrapper size={size}>
      {typeof icon === "string" && (
        <img
          src={icon}
          alt={label ?? ""}
          css={css`
            width: 100%;
            height: 100%;
            object-fit: contain;
          `}
        />
      )}
    </IconWrapper>
  );
};
export default AssetIcon;
