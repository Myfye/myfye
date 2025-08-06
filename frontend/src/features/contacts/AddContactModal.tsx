import { css } from "@emotion/react";
import Modal from "@/shared/components/ui/modal/Modal";
import { Contact } from "./contacts.types";

interface AddContactModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onContactAdd: (contact: Contact) => void;
}
const AddContactModal = ({
  isOpen,
  onOpenChange,
  onContactAdd,
}: AddContactModalProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add Contact"
        height={600}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
            padding-block-end: var(--size-200);
          `}
        >
          <div></div>
        </div>
      </Modal>
    </>
  );
};

export default AddContactModal;
