import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import Modal from "@/shared/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useRef } from "react";

const AddContactModal = ({ isOpen, onOpenChange, onContactAdd }) => {
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

export default SendModal;
