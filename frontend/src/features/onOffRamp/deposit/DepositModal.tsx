import { useState } from "react";

import { css } from "@emotion/react";
import { Bank, Wallet } from "@phosphor-icons/react";
import ModalButton from "../_components/ModalButton";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/shared/components/ui/modal/Modal";
import { RootState } from "@/redux/store";
// import toast from "react-hot-toast/headless";
import OnChainDepositContent from "./onChain/OnChainDepositContent";
import OffChainDepositOverlay from "./offChain/DepositOffChainOverlay";
import { useFundWallet } from "@privy-io/react-auth/solana";
import { AnimatePresence, useMotionValue, animate } from "motion/react";
import toast from "react-hot-toast/headless";
import { toggleModal, unmount } from "./depositSlice";
import {
  toggleOverlay,
  unmount as unmountOffChain,
} from "./offChain/depositOffChainSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const DepositModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.deposit.modal.isOpen);
  const height = useMotionValue(360);

  const [isOnChainDepositOpen, setOnChainDepositOpen] = useState(false);

  // const solanaPubKey = useSelector(
  //   (state: any) => state.userWalletData.solanaPubKey
  // );

  // const currentUserKYCVerified = useSelector(
  //   (state: RootState) => state.userWalletData.currentUserKYCVerified
  // );

  const toggleOnChainDepositScreen = async (isOpen: boolean) => {
    setOnChainDepositOpen(isOpen);
    if (isOpen) {
      await animate(height, 400, {
        type: "inertia",
        bounceStiffness: 300,
        bounceDamping: 40,
        timeConstant: 300,
        min: 400,
        max: 400,
      });
    }
  };

  // const onOffChainDepositScreenOpen = (isOpen: boolean) => {
  //   // if (!currentUserKYCVerified) {
  //   //   dispatch(toggleKYCModal({ isOpen: true }));
  //   // } else {
  //   //   setOffChainDepositOpen(isOpen);
  //   // }
  //   setOffChainDepositOpen(isOpen);
  // };

  return (
    <>
      <Modal
        zIndex={1000}
        isOpen={isOpen}
        onOpenChange={(isOpen) => dispatch(toggleModal(isOpen))}
        title="Deposit"
        height={height}
        onExit={() => {
          unmount();
          unmountOffChain();
          toggleOnChainDepositScreen(false);
          height.set(360);
        }}
      >
        <AnimatePresence>
          {isOnChainDepositOpen ? (
            <OnChainDepositContent
              onAddressCopy={(address) => {
                navigator.clipboard.writeText(address);
                toast.success("Copied wallet address!");
                onOpenChange(false);
              }}
            />
          ) : (
            <menu
              css={css`
                display: flex;
                flex-direction: column;
                gap: var(--size-150);
                padding-inline: var(--size-200);
              `}
            >
              <ModalButton
                icon={Wallet}
                title="Wallet"
                description="Deposit via wallet address"
                onPress={async () =>
                  void (await toggleOnChainDepositScreen(true))
                }
              />
              <ModalButton
                icon={Bank}
                title="Bank Account"
                description="Deposit via bank transfer"
                onPress={() => {
                  dispatch(
                    toggleOverlay({ type: "depositOffChain", isOpen: true })
                  );
                }}
              />
              <ModalButton
                icon={Bank}
                title="Card / Apple Pay / Google Pay"
                description="Deposit via credit/debit card"
                onPress={() => {}}
              />
            </menu>
          )}
        </AnimatePresence>
      </Modal>
      <OffChainDepositOverlay />
    </>
  );
};

export default DepositModal;
