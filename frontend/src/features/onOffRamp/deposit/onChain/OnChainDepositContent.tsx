import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { Copy, Info } from "@phosphor-icons/react";
import QRCode from "../../../qr-code/QRCode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Modal from "@/shared/components/ui/modal/Modal";
import { setDepositModalOpen } from "@/redux/modalReducers";
import toast from "react-hot-toast/headless";

const OnChainDepositOverlay = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch();
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector((state: any) => state.userWalletData.solanaPubKey);
  const [selectedChain, setSelectedChain] = useState("solana"); // Disable base for now
  const [showCopiedAddress, setShowCopiedAddress] = useState(false);

  const selectedAddress = selectedChain === "base" ? evmPubKey : solanaPubKey;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedAddress);
    setShowCopiedAddress(true);
    onOpenChange(false);
    dispatch(setDepositModalOpen(false));
    toast.success("Address copied!");
  };

  const getTruncatedAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
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
        <QRCode
          data={selectedAddress}
          color="#000407"
          chain={selectedChain}
        />
      </section>
      <section
        css={css`
          padding-inline: var(--size-200);
          padding-bottom: var(--size-200);
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--size-100);
            padding: var(--size-150);
            background-color: var(--clr-surface-raised);
            border-radius: var(--border-radius-small);
            margin-bottom: var(--size-200);
            color: var(--clr-text);
            font-size: var(--fs-small);
          `}
        >
          <Info size={16} weight="fill" color="#F8C86F" />
          <span>Make sure to send funds on Solana</span>
        </div>
        <Button expand icon={Copy} onPress={handleCopyAddress}>
          {`Copy ${selectedChain === "base" ? "Base" : "Solana"} Address`}
        </Button>
      </section>
    </div>
  );
};

export default OnChainDepositOverlay;
