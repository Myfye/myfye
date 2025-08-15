import { BR, MX, US } from "country-flag-icons/react/3x2";
import IconWrapper from "./IconWrapper";
import { getIconSize, IconSize } from "./utils";

interface FlagIconProps {
  flag: "US" | "MX" | "BR";
  width?: string;
  size?: IconSize;
}
const FlagIcon = ({ flag, size = "medium" }: FlagIconProps) => {
  const iconSize = getIconSize(size);
  return (
    <IconWrapper
      size={size}
      backgroundColor="var(--clr-green-100)"
      border="2px solid var(--clr-primary)"
    >
      {flag === "BR" && <BR width={iconSize} height={iconSize} />}
      {flag === "MX" && <MX width={iconSize} height={iconSize} />}
      {flag === "US" && <US width={iconSize} height={iconSize} />}
    </IconWrapper>
  );
};
export default FlagIcon;
