import IconWrapper from "./IconWrapper";
import { BankIcon as _BankIcon } from "@phosphor-icons/react";
import { getIconSize, IconSize } from "./utils";

interface BankIconProps {
  size?: IconSize;
  type?: "default" | "neutral";
}
const BankIcon = ({ size = "medium", type = "default" }: BankIconProps) => {
  const iconSize = getIconSize(size);
  return (
    <IconWrapper
      size={size}
      backgroundColor={
        type === "default" ? "var(--clr-primary)" : "var(--clr-surface-lowered)"
      }
    >
      <_BankIcon
        size={iconSize}
        color={type === "default" ? "var(--clr-white)" : "var(--clr-icon)"}
        weight={type === "default" ? "fill" : "regular"}
      />
    </IconWrapper>
  );
};
export default BankIcon;
