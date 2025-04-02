import { useEffect, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { Bank, Copy, Wallet, X } from "@phosphor-icons/react";
import ModalButton from "../../components/app/modals/buttons/ModalButton";
import QRCode from "../qr-code/QRCode";
import { useSelector } from "react-redux";
import Modal from "@/components/ui/modal/Modal";

const DepositModal = ({ isOpen, onOpenChange }) => {
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );
  const [selectedChain, setSelectedChain] = useState<"base" | "solana">("base");
  const [showCopiedAddress, setShowCopiedAddress] = useState(false);

  const [isWalletOpen, setWalletOpen] = useState(false);

  const [height, setHeight] = useState(360);

  const resetModal = () => {
    setWalletOpen(false);
    setHeight(360);
    setShowCopiedAddress(false);
  };

  const openWallet = () => {
    setWalletOpen(true);
    setHeight(580);
  };

  const selectedAddress = selectedChain === "base" ? evmPubKey : solanaPubKey;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedAddress);
    setShowCopiedAddress(true);
    setTimeout(() => {
      onOpenChange(false);
    }, 1700);
  };

  const getTruncatedAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Deposit On Chain"
        height={height}
        onAnimationComplete={() => {
          isOpen && resetModal();
        }}
      >
        {!isWalletOpen ? (
          <menu
            css={css`
              margin-block-start: var(--size-500);
              display: flex;
              flex-direction: column;
              gap: var(--size-200);
            `}
          >
            <li>
              <ModalButton
                icon={Wallet}
                title="Wallet"
                description="Deposit via wallet address"
                onPress={openWallet}
              ></ModalButton>
            </li>
            <li>
              <ModalButton
                icon={Bank}
                title="Fiat"
                description="Deposit via bank transfer"
              ></ModalButton>
            </li>
          </menu>
        ) : (
          <div
            className="qr-code-container"
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-block-start: var(--size-400);
            `}
          >
            <div
              css={css`
                display: flex;
                gap: var(--size-200);
                margin-bottom: var(--size-400);
              `}
            >
              <Button
                variant={selectedChain === "base" ? "primary" : "ghost"}
                onPress={() => setSelectedChain("base")}
              >
                Base
              </Button>
              <Button
                variant={selectedChain === "solana" ? "primary" : "ghost"}
                onPress={() => setSelectedChain("solana")}
              >
                Solana
              </Button>
            </div>
            <QRCode
              data={selectedAddress}
              color="#000407"
              chain={selectedChain}
            />
            <Button
              expand
              size="x-large"
              icon={Copy}
              css={css`
                margin-block-start: var(--size-500);
              `}
              onPress={handleCopyAddress}
            >
              {showCopiedAddress
                ? getTruncatedAddress(selectedAddress)
                : `Copy ${
                    selectedChain === "base" ? "Base" : "Solana"
                  } Address`}
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DepositModal;
