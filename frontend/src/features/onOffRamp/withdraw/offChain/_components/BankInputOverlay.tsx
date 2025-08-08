import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Input from "@/shared/components/ui/inputs/Input";
import Button from "@/shared/components/ui/button/Button";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../../../../../env";
import toast from "react-hot-toast/headless";
import { useSelector } from "react-redux";
import { ArrowLeft } from "@phosphor-icons/react";

interface BankInputOverlayProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedBank: {
    code: string;
    name: string;
    icon: string;
  };
  onBankAccountCreated: (newBankAccount: any) => void;
  onBack: () => void;
}

const BankInputOverlay = ({
  isOpen,
  onOpenChange,
  selectedBank,
  onBankAccountCreated,
  onBack,
}: BankInputOverlayProps) => {
  const [name, setName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [speiClabe, setSpeiClabe] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentUserID = useSelector(
    (state: any) => state.userWalletData.currentUserID
  );
  const currentUserFirstName = useSelector(
    (state: any) => state.userWalletData.currentUserFirstName
  );
  const currentUserLastName = useSelector(
    (state: any) => state.userWalletData.currentUserLastName
  );
  const blindPayReceiverId = useSelector(
    (state: any) => state.userWalletData.blindPayReceiverId
  );

  // Set beneficiary name to user's full name when component mounts
  useEffect(() => {
    if (currentUserFirstName && currentUserLastName) {
      setBeneficiaryName(`${currentUserFirstName} ${currentUserLastName}`);
    }
  }, [currentUserFirstName, currentUserLastName]);

  const handleAddBankAccount = async () => {
    if (!name.trim() || !beneficiaryName.trim() || !speiClabe.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!currentUserID) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${MYFYE_BACKEND}/add_bank_account`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({
          user_id: currentUserID,
          receiver_id: blindPayReceiverId,
          name: name.trim(),
          beneficiary_name: beneficiaryName.trim(),
          spei_institution_code: selectedBank.code,
          spei_clabe: speiClabe.trim(),
          type: "spei_bitso",
          spei_protocol: "clabe",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Error adding bank account";
        toast.error(errorMessage);
        return;
      }

      const result = await response.json();
      console.log("Bank account added successfully:", result);
      toast.success("Bank account added successfully");

      // Reset form
      setName("");
      setBeneficiaryName(
        currentUserFirstName && currentUserLastName
          ? `${currentUserFirstName} ${currentUserLastName}`
          : ""
      );
      setSpeiClabe("");

      // Close overlay and notify parent with new account
      onOpenChange(false);
      if (result && result.data) {
        onBankAccountCreated(result.data);
      } else {
        onBankAccountCreated(undefined);
      }
    } catch (error) {
      console.error("Error adding bank account:", error);
      toast.error("Failed to add bank account");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim() && beneficiaryName.trim() && speiClabe.trim();

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(newIsOpen) => {
        if (!newIsOpen) {
          onBack();
        }
      }}
      title="Add Bank Account"
      leftIcon={<ArrowLeft size={24} />}
      onLeftIconClick={onBack}
    >
      <div
        css={css`
          padding: var(--size-200);
          height: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <div
          css={css`
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--size-200);
          `}
        >
          {/* Selected Bank Display */}
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: var(--size-150);
              padding: var(--size-200);
              border-radius: var(--border-radius-medium);
              background-color: var(--clr-surface-raised);
              border: 2px solid var(--clr-primary);
            `}
          >
            <img
              src={selectedBank.icon}
              alt={selectedBank.name}
              css={css`
                width: 48px;
                height: 48px;
                border-radius: var(--border-radius-small);
                object-fit: cover;
              `}
            />
            <div>
              <p
                css={css`
                  font-weight: var(--fw-semibold);
                  color: var(--clr-text);
                  margin: 0;
                  font-size: var(--text-base);
                `}
              >
                {selectedBank.name}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-200);
            `}
          >
            <Input
              label="Account Name"
              id="account-name"
              hideLabel={false}
              placeholder="e.g., Account 123"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Beneficiary Name"
              id="beneficiary-name"
              hideLabel={false}
              placeholder={currentUserFirstName + " " + currentUserLastName}
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
            />

            <Input
              label="CLABE Number"
              id="spei-clabe"
              hideLabel={false}
              placeholder="18-digit CLABE number"
              value={speiClabe}
              onChange={(e) => setSpeiClabe(e.target.value)}
            />
          </div>
        </div>

        {/* Add Bank Account Button */}
        <div
          css={css`
            padding-top: var(--size-200);
          `}
        >
          <Button
            expand
            variant="primary"
            onPress={handleAddBankAccount}
            disabled={!isFormValid || isLoading}
            css={css`
              opacity: ${!isFormValid || isLoading ? 0.5 : 1};
            `}
          >
            {isLoading ? "Adding..." : "Add Bank Account"}
          </Button>
        </div>
      </div>
    </Overlay>
  );
};

export default BankInputOverlay;
