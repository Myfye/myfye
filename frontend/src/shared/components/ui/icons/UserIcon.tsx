import IconWrapper from "./IconWrapper";
import { UserIcon as _UserIcon } from "@phosphor-icons/react";
import { getIconSize, IconSize } from "./utils";

interface UserIconProps {
  size?: IconSize;
}
const UserIcon = ({ size = "medium" }: UserIconProps) => {
  const iconSize = getIconSize(size);
  return (
    <IconWrapper backgroundColor="var(--clr-surface-lowered)" size={size}>
      <_UserIcon size={iconSize} />
    </IconWrapper>
  );
};
export default UserIcon;
