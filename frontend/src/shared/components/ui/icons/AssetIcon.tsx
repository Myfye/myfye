import IconWrapper from "./IconWrapper";
import { User } from "@phosphor-icons/react";

interface AssetIconProps {
  src?: string;
  alt?: string;
  width?: string;
}
const AssetIcon = ({ src, alt, width = "2.75rem" }: AssetIconProps) => {
  if (!src) throw new Error("No img source defined");
  return (
    <IconWrapper width={width}>
      {src && <img src={src} alt={alt} />}
    </IconWrapper>
  );
};
export default AssetIcon;
