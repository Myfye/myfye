import { useState } from "react";
import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { Copy } from "@phosphor-icons/react";
import QRCode from "../../../qr-code/QRCode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast/headless";

interface OnChainDepositContentProps {
  onAddressCopy?: () => void;
}

const getTruncatedAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const OnChainDepositContent = ({
  onAddressCopy,
}: OnChainDepositContentProps) => {
  const dispatch = useDispatch();
  const evmPubKey = useSelector(
    (state: RootState) => state.userWalletData.evmPubKey
  );
  const solanaPubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );
  const [selectedChain, setSelectedChain] = useState("solana"); // Disable base for now

  const selectedAddress = selectedChain === "base" ? evmPubKey : solanaPubKey;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedAddress);
    toast.success(`Address ${getTruncatedAddress(selectedAddress)} copied!`);
    onAddressCopy && onAddressCopy();
  };

  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: var(--size-200);
        height: 100%;
        min-height: 500px;
        max-height: 580px;
      `}
    >
      <section>
        {/* Disable base for now 
        <menu
          css={css`
            display: flex;
            gap: var(--controls-gap-medium);
            padding-inline: var(--size-200);
            width: fit-content;
            margin-inline: auto;
          `}
        >
          <li>
            <Button
              variant={selectedChain === "base" ? "primary" : "secondary"}
              onPress={() => setSelectedChain("base")}
            >
              Base
            </Button>
          </li>
          <li>
            <Button
              variant={selectedChain === "solana" ? "primary" : "secondary"}
              onPress={() => setSelectedChain("solana")}
            >
              Solana
            </Button>
          </li>
        </menu>
        */}
      </section>
      <section
        css={css`
          display: grid;
          place-items: center;
          padding-inline: var(--size-200);
        `}
      >
        <QRCode data={selectedAddress} color="#000407" chain={selectedChain} />
      </section>
      <section
        css={css`
          padding-inline: var(--size-200);
          padding-bottom: var(--size-200);
        `}
      >
        <Button expand icon={Copy} onPress={handleCopyAddress}>
          {`Copy ${selectedChain === "base" ? "Base" : "Solana"} Address`}
        </Button>
      </section>
    </div>
  );
};

export default OnChainDepositContent;
