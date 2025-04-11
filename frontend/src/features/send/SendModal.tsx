import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Modal from "@/components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleModal, toggleOverlay, updateAmount } from "./sendSlice";
import { useEffect, useMemo, useRef } from "react";

const SendModal = () => {
  const isOpen = useSelector((state: RootState) => state.send.modal.isOpen);
  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleModal({ isOpen }));
  };

  const dispatch = useDispatch();

  const transaction = useSelector((state: RootState) => state.send.transaction);
  const assets = useSelector((state: RootState) => state.assets);

  const intervalDelete = useRef<NodeJS.Timeout | null>(null);
  const delayDelete = useRef<NodeJS.Timeout | null>(null);

  const startDelete = (input: string) => {
    intervalDelete.current = setInterval(() => {
      dispatch(updateAmount({ input }));
    }, 50);
  };

  const stopDelete = () => {
    if (intervalDelete.current) {
      clearInterval(intervalDelete.current);
    }
    if (delayDelete.current) {
      clearTimeout(delayDelete.current);
    }
  };

  useEffect(() => {
    if (transaction.formattedAmount === "") stopDelete();
  }, [transaction]);

  const handleNumberPressStart = (input: string) => {
    if (input === "delete") {
      dispatch(updateAmount({ input }));
      delayDelete.current = setTimeout(() => {
        startDelete(input);
      }, 200);
    }
  };

  const handleNumberPress = (input: string) => {
    if (input === "delete") return;
    dispatch(updateAmount({ input }));
  };

  const handleNumberPressEnd = () => {
    stopDelete();
  };

  const handleSendConfirmation = () => {
    dispatch(toggleOverlay({ type: "selectContact", isOpen: true }));
  };

  const isInvalidSendTransaction = useMemo(() => {
    if (!transaction.assetId) return true;
    if (transaction.amount === 0 || transaction.amount === null) return true;
    if (assets.assets[transaction.assetId].balance < transaction.amount)
      return true;
    return false;
  }, [transaction, assets]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Send"
        height={600}
      >
        <NumberPad
          onNumberPress={handleNumberPress}
          onNumberPressEnd={handleNumberPressEnd}
          onNumberPressStart={handleNumberPressStart}
        />
        <Button
          isDisabled={isInvalidSendTransaction}
          onPress={handleSendConfirmation}
        >
          Select contact
        </Button>
      </Modal>
    </>
  );
};

export default SendModal;
