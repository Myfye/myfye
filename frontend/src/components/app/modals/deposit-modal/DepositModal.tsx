import { useEffect, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { Bank, Copy, Wallet, X } from "@phosphor-icons/react";
import ModalButton from "../buttons/ModalButton";
import QRCode from "../../qr-code/QRCode";
import { useSelector } from "react-redux";
import Modal from "@/components/ui/modal/Modal";

const DepositModal = ({ isOpen, onOpenChange }) => {
  const pubKey = useSelector((state: any) => state.userWalletData.pubKey);

  const [isWalletOpen, setWalletOpen] = useState(false);

  const [height, setHeight] = useState(360);

  const resetModal = () => {
    setWalletOpen(false);
    setHeight(360);
  };

  const openWallet = () => {
    setWalletOpen(true);
    setHeight(580);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Deposit"
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
            <QRCode data={pubKey} color="#000407" />
            <p
              css={css`
                margin-block-start: var(--size-400);
                color: var(--clr-text);
                max-width: 35ch;
                margin-inline: auto;
                word-break: break-all;
                white-space: normal;
                text-align: center;
                font-size: var(--fs-small);
              `}
            >
              {pubKey}
            </p>
            <Button
              expand
              size="x-large"
              icon={Copy}
              css={css`
                margin-block-start: var(--size-500);
              `}
              onPress={() => {
                navigator.clipboard.writeText(pubKey);
                onOpenChange(false);
              }}
            >
              Copy address
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DepositModal;
