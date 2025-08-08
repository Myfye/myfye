import { Wallet } from "@phosphor-icons/react/dist/ssr";
import IconWrapper from "./IconWrapper";

const WalletIcon = ({ width = "2.75rem" }) => {
  return (
    <IconWrapper width={width} backgroundColor="var(--clr-surface-lowered)">
      <Wallet size={24} />
    </IconWrapper>
  );
};
export default WalletIcon;
