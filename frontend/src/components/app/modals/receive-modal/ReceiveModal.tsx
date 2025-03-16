/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { Copy as CopyIcon, X } from "@phosphor-icons/react";
import QRCode from "../../qr-code/QRCode";
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
        height={580}
      >
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
