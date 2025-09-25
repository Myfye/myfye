import { css } from "@emotion/react";
import { BankIcon, WalletIcon } from "@phosphor-icons/react";
import ModalButton from "../_components/ModalButton";
import Modal from "@/shared/components/ui/modal/Modal";
import { toggleModal, toggleOverlay } from "./withdrawSlice";
import { toggleOverlay as toggleOnChainOverlay } from "./onChain/withdrawOnChainSlice";
import { toggleOverlay as toggleOffChainOverlay } from "./offChain/withdrawOffChainSlice";
import WithdrawOnChainOverlay from "./onChain/WithdrawOnChainOverlay";
import WithdrawOffChainOverlay from "./offChain/WithdrawOffChainOverlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import WithdrawOffChainBankPickerOverlay from "./offChain/WithdrawOffChainBankPickerOverlay";
import WithdrawOffChainBankInputOverlay from "./offChain/WithdrawOffChainBankInputOverlay";
import WithdrawOffChainSelectAssetOverlay from "./offChain/WithdrawOffChainSelectAssetOverlay";
import WithdrawProcessingTransactionOverlay from "./onChain/WithdrawOnChainProcessingTransactionOverlay";
import { toggleModal as toggleKYCModal } from "@/features/compliance/kycSlice";
import EtherfuseRampOverlay from "./offChain/etherfuseRamp";

const WithdrawModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.withdraw.modal.isOpen);
  const currentUserKYCStatus = useAppSelector(
    (state) => state.userWalletData.currentUserKYCStatus
  );
  return (
    <>
      <Modal
        height={300}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleModal(isOpen));
        }}
        title="Withdraw"
        zIndex={1000}
      >
        <menu
          css={css`
            display: flex;
            flex-direction: column;
            gap: var(--size-200);
            padding-inline: var(--size-200);
          `}
        >
          <li>
            <ModalButton
              icon={WalletIcon}
              title="To wallet"
              description="Send money on chain"
              onPress={() => {
                dispatch(
                  toggleOnChainOverlay({
                    type: "withdrawOnChain",
                    isOpen: true,
                  })
                );
              }}
            />
          </li>
          <li>
            <ModalButton
              icon={BankIcon}
              title="To bank account"
              description="Send money to bank account"
              onPress={() => {
                dispatch(toggleOverlay({ type: "etherfuse", isOpen: true }));
              }}
            />
          </li>
        </menu>
      </Modal>
      {/* On Chain */}
      <WithdrawOnChainOverlay zIndex={2000} />
      {/* Off Chain */}
      <WithdrawOffChainOverlay />
      <WithdrawOffChainBankPickerOverlay />
      <WithdrawOffChainBankInputOverlay />
      <WithdrawOffChainSelectAssetOverlay zIndex={9999} />
      <WithdrawProcessingTransactionOverlay />
      {/* Etherfuse Withdraw */}
      <EtherfuseRampOverlay />
    </>
  );
};

export default WithdrawModal;
