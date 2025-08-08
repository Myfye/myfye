import IconWrapper from "./IconWrapper";
import { User } from "@phosphor-icons/react";

const UserIcon = ({ width = "2.75rem" }) => {
  return (
    <IconWrapper width={width} backgroundColor="var(--clr-surface-lowered)">
      <User size={24} />
    </IconWrapper>
  );
};
export default UserIcon;
