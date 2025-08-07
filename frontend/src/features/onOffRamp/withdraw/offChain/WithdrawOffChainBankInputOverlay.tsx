import { css } from "@emotion/react";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../../../../env";
import toast from "react-hot-toast/headless";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay, updateBankInfo } from "./withdrawOffChainSlice";
import TextInput from "@/shared/components/ui/inputs/TextInput";
import { bankMap } from "./_components/bankMap";
import { BankInfo } from "./withdrawOffChain.types";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { useLazyAddBankAccountQuery } from "../withdrawApi";

interface BankInputOverlayProps
  extends Omit<OverlayProps, "isOpen" | "onOpenChange" | "children"> {}

const WithdrawOffChainBankInputOverlay = ({
  ...restProps
}: BankInputOverlayProps) => {
  const dispatch = useDispatch();
  const isOpen = useAppSelector(
    (state) => state.withdrawOffChain.overlays.bankInput.isOpen
  );
  const userId = useAppSelector((state) => state.userWalletData.currentUserID);
  const userFirstName = useAppSelector(
    (state) => state.userWalletData.currentUserFirstName
  );
  const userLastName = useAppSelector(
    (state) => state.userWalletData.currentUserLastName
  );
  const blindPayReceiverId = useAppSelector(
    (state) => state.userWalletData.blindPayReceiverId
  );
  const bankInfo = useAppSelector(
    (state) => state.withdrawOffChain.transaction.bankInfo
  );
  const fullName =
    userFirstName && userLastName ? userFirstName + " " + userLastName : "";

  const [accountName, setAccountName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [clabeNumber, setClabeNumber] = useState("");

  const [triggerAddBankAccount, { isLoading }] = useLazyAddBankAccountQuery();

  const bank = bankMap.ids
    .map((id) => bankMap.banks[id])
    .find((bank) => bank.code === bankInfo.code);

  const handleAddBankAccount = async () => {
    if (!accountName.trim() || !beneficiaryName.trim() || !clabeNumber.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    const { data, isSuccess, isError } = await triggerAddBankAccount({
      userId,
      receiverId: blindPayReceiverId,
      accountName: accountName.trim(),
      beneficiaryName: beneficiaryName.trim(),
      speiInstitutionCode: bankInfo.code,
      speiClabe: clabeNumber.trim(),
    });

    if (isError) {
      return toast.error("Error adding bank account. Please try again.");
    }

    if (isSuccess) {
      dispatch(toggleOverlay({ type: "bankPicker", isOpen: false }));
      dispatch(toggleOverlay({ type: "bankInput", isOpen: false }));
      return toast.success("Added bank account!");
    } else {
      return;
    }
  };

  return (
    <Overlay
      {...restProps}
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        dispatch(toggleOverlay({ type: "bankInput", isOpen }));
      }}
      zIndex={2002}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding-inline: var(--size-400);
          padding-block-end: var(--size-200);
          height: 100%;
        `}
      >
        <div>
          <div
            css={css`
              display: grid;
              grid-template-columns: auto 1fr;
              align-items: center;
              gap: var(--size-150);
              margin-block-start: var(--size-300);
            `}
          >
            <img
              src={bank?.icon}
              alt=""
              css={css`
                width: var(--size-800);
                aspect-ratio: 1;
                object-fit: cover;
                border-radius: var(--border-radius-circle);
              `}
            />
            <span className="heading-large">{bank?.label}</span>
          </div>
          <section
            css={css`
              margin-block-start: var(--size-500);
            `}
          >
            <h2 className="heading-x-large" css={css``}>
              Enter your credentials
            </h2>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: var(--size-150);
                margin-block-start: var(--size-300);
              `}
            >
              <TextInput
                label="Account Name"
                id="account-name"
                placeholder="e.g. Account 123"
                onChange={(e) => {
                  setAccountName(e);
                  // dispatch(updateBankInfo({ accountName: e }))
                }}
              />

              <TextInput
                label="Beneficiary Name"
                id="beneficiary-name"
                placeholder={fullName || "John Smith"}
                defaultValue={fullName}
                onChange={
                  (e) => setBeneficiaryName(e)
                  // dispatch(updateBankInfo({ beneficiaryName: e }))
                }
              />

              <TextInput
                label="CLABE Number"
                id="spei-clabe"
                placeholder="001122334455667788"
                onChange={(e) => {
                  setClabeNumber(e);
                  // dispatch(updateBankInfo({ speiClabe: e }));
                }}
              />
            </div>
          </section>
        </div>
        <div
          css={css`
            margin-block-start: auto;
            padding-top: var(--size-200);
          `}
        >
          <Button
            expand
            variant="primary"
            onPress={() => {
              handleAddBankAccount();
            }}
            isLoading={isLoading}
            isDisabled={
              !accountName.trim() ||
              !beneficiaryName.trim() ||
              !clabeNumber.trim()
            }
          >
            Add bank
          </Button>
        </div>
      </div>
    </Overlay>
  );
};

export default WithdrawOffChainBankInputOverlay;
