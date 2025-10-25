import { useState } from "react";
import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { CopyIcon } from "@phosphor-icons/react";
import QRCode from "../../../qr-code/components/QRCode";
import { HTMLMotionProps, motion } from "motion/react";
import { useAppSelector } from "@/redux/hooks";

interface OnChainDepositContentProps extends HTMLMotionProps<"div"> {
  onAddressCopy?: (address: string) => void;
}

const OnChainDepositContent = ({
  onAddressCopy,
  ...restProps
}: OnChainDepositContentProps) => {
  const evmPubKey = useAppSelector((state) => state.userWalletData.evmPubKey);
  const solanaPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );
  const [selectedChain] = useState("solana"); // Disable base for now

  const selectedAddress = selectedChain === "base" ? evmPubKey : solanaPubKey;

  console.log(selectedAddress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="qr-code-container"
      css={css`
        display: grid;
        place-items: center;
        height: 100%;
        padding-block-start: var(--size-100);
        padding-inline: var(--size-200);
        padding-block-end: var(--size-200);
      `}
      {...restProps}
    >
      <div className="qr-code-wrapper">
        <QRCode data={selectedAddress} color="var(--clr-black)" size={200} />
      </div>
      <div
        css={css`
          width: 100%;
          margin-block-start: auto;
        `}
      >
        <Button
          expand
          icon={CopyIcon}
          onPress={() => {
            onAddressCopy && onAddressCopy(selectedAddress);
          }}
        >
          Copy address
        </Button>
      </div>
    </motion.div>
  );
};

export default OnChainDepositContent;
