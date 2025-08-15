import { WalletIcon as _WalletIcon } from "@phosphor-icons/react";
import IconWrapper from "./IconWrapper";
import { getIconSize, IconSize } from "./utils";

interface WalletIconProps {
  size?: IconSize;
}
const WalletIcon = ({ size = "medium" }: WalletIconProps) => {
  const iconSize = getIconSize(size);
  return (
    <IconWrapper backgroundColor="var(--clr-surface-lowered)" size={size}>
      <_WalletIcon size={iconSize} />
    </IconWrapper>
  );
};
export default WalletIcon;
