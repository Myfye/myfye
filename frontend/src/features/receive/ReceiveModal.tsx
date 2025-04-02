/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { Copy as CopyIcon, X } from "@phosphor-icons/react";
import QRCode from "../qr-code/QRCode";
import { useSelector } from "react-redux";
import Modal from "@/components/ui/modal/Modal";

const ReceiveModal = ({ isOpen, onOpenChange }) => {
  const pubKey = useSelector((state: any) => state.userWalletData.pubKey);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Receive"
        height={480}
      >
        <div
          className="qr-code-container"
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            padding-inline: var(--size-200);
            padding-block-end: var(--size-200);
          `}
        >
          <QRCode data={pubKey} color="#000407" />
          <Button
            expand
            icon={CopyIcon}
            css={css`
              margin-block-start: var(--size-500);
            `}
            onPress={() => {
              navigator.clipboard.writeText(pubKey);
              return onOpenChange(false);
            }}
          >
            Copy address
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ReceiveModal;
