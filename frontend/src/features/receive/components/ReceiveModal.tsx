import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import QRCode from "../../qr-code/components/QRCode";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/shared/components/ui/modal/Modal";
import { RootState } from "@/redux/store";
import { toggleModal } from "../stores/receiveSlice";
import toast from "react-hot-toast/headless";
import { useAppSelector } from "@/redux/hooks";
import { CopyIcon } from "@phosphor-icons/react";

const ReceiveModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.receive.modal.isOpen);
  const onOpenChange = (isOpen: boolean) => {
    dispatch(toggleModal(isOpen));
  };

  const key = useAppSelector((state) => state.userWalletData.solanaPubKey);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Receive"
        height={400}
      >
        <div
          className="qr-code-container"
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding-block-start: var(--size-200);
            padding-inline: var(--size-200);
            padding-block-end: var(--size-200);
          `}
        >
          <div className="qr-code-wrapper">
            <QRCode data={key} color="var(--clr-black)" size={200} />
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
                navigator.clipboard.writeText(key);
                toast.success("Copied wallet address!");
                onOpenChange(false);
              }}
            >
              Copy address
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReceiveModal;
