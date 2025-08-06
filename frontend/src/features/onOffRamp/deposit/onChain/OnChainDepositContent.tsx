import { useState } from "react";
import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { Copy } from "@phosphor-icons/react";
import QRCode from "../../../qr-code/QRCode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast/headless";
import { HTMLMotionProps, motion } from "motion/react";

interface OnChainDepositContentProps extends HTMLMotionProps<"div"> {
  onAddressCopy?: (address: string) => void;
}

const OnChainDepositContent = ({
  onAddressCopy,
  ...restProps
}: OnChainDepositContentProps) => {
  const dispatch = useDispatch();
  const evmPubKey = useSelector(
    (state: RootState) => state.userWalletData.evmPubKey
  );
  const solanaPubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );
  const [selectedChain] = useState("solana"); // Disable base for now

  const selectedAddress = selectedChain === "base" ? evmPubKey : solanaPubKey;

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
        padding-block-start: var(--size-200);
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
          icon={Copy}
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
