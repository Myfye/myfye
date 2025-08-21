import { css } from "@emotion/react";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import toast from "react-hot-toast/headless";
import { useDispatch } from "react-redux";
import { toggleOverlay } from "./withdrawOffChainSlice";
import TextInput from "@/shared/components/ui/inputs/TextInput";
import { bankMap } from "./_components/bankMap";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { useLazyAddBankAccountQuery } from "../withdrawApi";
import { addBankAccount } from "./withdrawOffChainSlice";

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

  const wallet = useAppSelector((state) => state.userWalletData);

  const fullName =
    userFirstName && userLastName ? userFirstName + " " + userLastName : "";

  const [accountName, setAccountName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [clabeNumber, setClabeNumber] = useState("");
  const [clabeNumberConfirm, setClabeNumberConfirm] = useState("");

  const [triggerAddBankAccount, { isLoading }] = useLazyAddBankAccountQuery();

  const bank = bankMap.ids
    .map((id) => bankMap.banks[id])
    .find((bank) => bank.code === bankInfo.code);

  const handleAddBankAccount = async () => {
    // Validate all required fields
    if (!accountName.trim()) {
      toast.error("Please enter an account name");
      return;
    }

    if (!beneficiaryName.trim()) {
      toast.error("Please enter a beneficiary name");
      return;
    }

    if (!clabeNumber.trim()) {
      toast.error("Please enter a CLABE number");
      return;
    }

    if (!clabeNumberConfirm.trim()) {
      toast.error("Please confirm your CLABE number");
      return;
    }

    // Validate CLABE numbers match
    if (clabeNumber.trim() !== clabeNumberConfirm.trim()) {
      toast.error("CLABE numbers do not match");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    if (!blindPayReceiverId) {
      toast.error("Receiver ID not found");
      return;
    }

    if (!bankInfo.code) {
      toast.error("Bank institution code not found");
      return;
    }

    // Log the data being sent for debugging
    console.log('Adding bank account with data:', {
      userId,
      receiverId: blindPayReceiverId,
      accountName: accountName.trim(),
      beneficiaryName: beneficiaryName.trim(),
      speiInstitutionCode: bankInfo.code,
      speiClabe: clabeNumber.trim(),
      bankInfo
    });

    try {
      const { data, isSuccess, isError, error } = await triggerAddBankAccount({
        userId,
        receiverId: blindPayReceiverId,
        accountName: accountName.trim(),
        beneficiaryName: beneficiaryName.trim(),
        speiInstitutionCode: bankInfo.code,
        speiClabe: clabeNumber.trim(),
      });

      console.log('🔍 Component - Add bank account response:', { data, isSuccess, isError, error });
      console.log('🔍 Component - Data type:', typeof data);
      console.log('🔍 Component - Data keys:', data ? Object.keys(data) : 'null');

      // Check for both RTK Query errors and backend failure responses
      if (isError) {
        console.error('❌ Component - RTK Query error:', error);
        // Extract error message from the error object
        let errorMessage = "Error adding bank account. Please try again.";
        
        if (error && typeof error === 'object') {
          // Handle nested error structure from backend
          if ('data' in error && error.data) {
            console.log('🔍 Component - Error data structure:', error.data);
            if (error.data.details && error.data.details.errors && error.data.details.errors.length > 0) {
              // Extract the first validation error message
              errorMessage = error.data.details.errors[0].message;
            } else if (error.data.message) {
              errorMessage = error.data.message;
            } else if (error.data.error) {
              errorMessage = error.data.error;
            }
          } else if ('error' in error && error.error) {
            errorMessage = error.error;
          } else if ('message' in error && error.message) {
            errorMessage = error.message;
          }
        }
        
        return toast.error(errorMessage);
      }

      // Check if the response data indicates a failure (even if RTK Query thinks it's successful)
      if (data && typeof data === 'object' && data.success === false) {
        console.error('❌ Component - Backend returned failure response:', data);
        let errorMessage = "Error adding bank account. Please try again.";
        
        if (data.details && data.details.errors && data.details.errors.length > 0) {
          // Extract the first validation error message
          errorMessage = data.details.errors[0].message;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        return toast.error(errorMessage);
      }

      if (isSuccess && data) {
        console.log('Successfully added bank account:', data);
        
        // Add the new bank account to Redux state
        const bankAccountData = data.data; // Access the nested data
        const newBankAccount = {
          id: bankAccountData.id,
          name: bankAccountData.name,
          beneficiary_name: bankAccountData.beneficiary_name || "",
          spei_institution_code: bankAccountData.spei_institution_code || "",
          spei_clabe: bankAccountData.spei_clabe || "",
        };
        console.log('Adding new bank account to Redux state:', newBankAccount);
        dispatch(addBankAccount(newBankAccount));
        
        dispatch(toggleOverlay({ type: "bankPicker", isOpen: false }));
        dispatch(toggleOverlay({ type: "bankInput", isOpen: false }));
        return toast.success("Added bank account!");
      } else {
        console.error('Unexpected response:', { data, isSuccess, isError });
        return toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error('Exception in handleAddBankAccount:', error);
      return toast.error("Failed to add bank account");
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
      onExit={() => {
        setAccountName("");
        setBeneficiaryName("");
        setClabeNumber("");
        setClabeNumberConfirm("");
      }}
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
          <section
            css={css`
              display: grid;
              grid-template-columns: auto 1fr;
              align-items: center;
              gap: var(--size-150);
              margin-block-start: var(--size-300);
              margin-inline: auto;
              width: fit-content;
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
            <h2 className="heading-large">{bank?.label}</h2>
          </section>
          <section
            css={css`
              margin-block-start: var(--size-500);
            `}
          >
            <h2
              className="heading-x-large"
              css={css`
                text-align: center;
              `}
            >
              Enter your credentials
            </h2>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: var(--size-150);
                margin-block-start: var(--size-400);
              `}
            >
              <TextInput
                label="Account Name"
                id="account-name"
                placeholder="e.g. Account 123"
                onChange={(e) => {
                  setAccountName(e);
                }}
              />

              <TextInput
                label="Beneficiary Name"
                id="beneficiary-name"
                placeholder={fullName || "John Smith"}
                defaultValue={fullName}
                onChange={(e) => setBeneficiaryName(e)}
              />

              <TextInput
                label="CLABE Number"
                id="spei-clabe"
                placeholder="002665000000000001"
                onChange={(e) => {
                  setClabeNumber(e);
                }}
                onPaste={(val) => {
                  setClabeNumber(val);
                }}
              />
              <TextInput
                label="Confirm CLABE Number"
                id="spei-clabe-confirm"
                placeholder="002665000000000001"
                value={clabeNumberConfirm}
                onChange={(e) => {
                  setClabeNumberConfirm(e);
                }}
                onPaste={(val) => {
                  setClabeNumberConfirm(val);
                }}
              />
            </div>
          </section>
        </div>
        <section
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
              !clabeNumber.trim() ||
              !clabeNumberConfirm.trim() ||
              clabeNumber.trim() !== clabeNumberConfirm.trim()
            }
          >
            Add bank
          </Button>
        </section>
      </div>
    </Overlay>
  );
};

export default WithdrawOffChainBankInputOverlay;
