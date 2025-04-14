import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { Copy as CopyIcon, X } from "@phosphor-icons/react";
import QRCode from "../qr-code/QRCode";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/components/ui/modal/Modal";
import { RootState } from "@/redux/store";
import { toggleModal } from "./receiveSlice";

const ReceiveModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.receive.modal.isOpen);
  const onOpenChange = (isOpen: boolean) => {
    dispatch(toggleModal(isOpen));
  };

  const key = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );

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
          <QRCode data={key} color="#000407" />
          <Button
            expand
            icon={CopyIcon}
            css={css`
              margin-block-start: var(--size-500);
            `}
            onPress={() => {
              navigator.clipboard.writeText(key);
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
