/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { X } from "@phosphor-icons/react";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Modal from "@/components/ui/modal/Modal";

const SendModal = ({ isOpen, onOpenChange }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Send"
        height={600}
      >
        <NumberPad />
      </Modal>
    </>
  );
};

export default SendModal;
