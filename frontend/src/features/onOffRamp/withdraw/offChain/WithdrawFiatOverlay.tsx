import { useState, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { Plus } from "@phosphor-icons/react";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../../../../env";
import toast from "react-hot-toast/headless";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import Lottie from "lottie-react";
import bbva from "@/assets/icons/bankIcons/bbva.png";
import banamex from "@/assets/icons/bankIcons/banamex.png";
import santander from "@/assets/icons/bankIcons/santander.png";
import hsbc from "@/assets/icons/bankIcons/hsbc.png";
import banorte from "@/assets/icons/bankIcons/banorte.jpg";
import bankIcon from "@/assets/icons/bankIcons/bankIcon.png";
import BankPickerOverlay from "./BankPickerOverlay";
import BankInputOverlay from "./BankInputOverlay";
import AmountInputOverlay from "./AmountInputOverlay";
import { useLottie } from "lottie-react";
import { RootState } from "@/redux/store";
import { useGetUserBankAccountsQuery } from "@/features/users/usersApi";
import { useCreatePayoutQuery } from "../withdrawApi";

/*
  40002 Banco Nacional de México (Banamex / Citibanamex)
  40012 BBVA México
  40014 Santander México
  40021 HSBC México
  40072 Banorte (Banco Mercantil del Norte)
  */

const OffChainWithdrawOverlay = ({ isOpen, onOpenChange }: OverlayProps) => {
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [selectedCurrency, setSelectedCurrency] = useState("MXN"); // MXN BRL USD
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);
  const [currentStep, setCurrentStep] = useState("amount"); // 'amount' or 'bankAccount'
  const [showBankPickerOverlay, setShowBankPickerOverlay] = useState(false);
  const [showBankInputOverlay, setShowBankInputOverlay] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showAmountInputOverlay, setShowAmountInputOverlay] = useState(false);

  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const currentUserID = useSelector(
    (state: any) => state.userWalletData.currentUserID
  );
  const blindPayEvmWalletId = useSelector(
    (state: any) => state.userWalletData.blindPayEvmWalletId
  );
  const blindPayReceiverId = useSelector(
    (state: any) => state.userWalletData.blindPayReceiverId
  );

  /* Public keys */
  const solanaPubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );

  const [canCreatePayout, setCanCreatePayout] = useState(false);

  const { isError, isLoading, isSuccess, isFetching } =
    useGetUserBankAccountsQuery(currentUserID);

  // const { isError, isLoading, isSuccess, isFetching } =
  // useCreatePayoutQuery({});

  const isSendDisabled = !formattedAmount || formattedAmount === "0";

  const getBankIcon = (institutionCode: string) => {
    switch (institutionCode) {
      case "40002":
        return banamex; // Banco Nacional de México (Banamex / Citibanamex)
      case "40012":
        return bbva; // BBVA México
      case "40014":
        return santander; // Santander México
      case "40021":
        return hsbc; // HSBC México
      case "40072":
        return banorte; // Banorte (Banco Mercantil del Norte)
      default:
        return bankIcon; // Default bank icon
    }
  };

  const handleNextButtonPress = async () => {
    if (selectedBankAccount && !showAmountInputOverlay) {
      setShowAmountInputOverlay(true);
    } else {
    }
  };

  const handleBankAccountSelect = (bankAccount) => {
    console.log("Bank account selected:", bankAccount);
    setSelectedBankAccount(bankAccount);
  };

  const handleCreateNewBankAccount = () => {
    setShowBankPickerOverlay(true);
  };

  const handleBankAccountCreated = (newBankAccount) => {
    // Refresh bank accounts list
    // fetchBankAccounts().then(() => {
    //   if (newBankAccount) {
    //     setSelectedBankAccount(newBankAccount);
    //   }
    // });
    setShowBankInputOverlay(false);
    setShowBankPickerOverlay(false);
  };

  const handleBankInputBack = () => {
    setShowBankInputOverlay(false);
    setShowBankPickerOverlay(true);
  };

  const handleBankSelect = (bankInfo) => {
    console.log("Bank selected from picker:", bankInfo);
    setSelectedBank(bankInfo);
    setShowBankInputOverlay(true);
  };

  const renderBankAccountCard = (bankAccount) => (
    <div
      key={bankAccount.id}
      css={css`
        display: flex;
        align-items: center;
        gap: var(--size-150);
        padding: var(--size-200);
        border-radius: var(--border-radius-medium);
        background-color: var(--clr-surface-raised);
        border: 2px solid
          ${selectedBankAccount?.id === bankAccount.id
            ? "var(--clr-primary)"
            : "transparent"};
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
          background-color: var(--clr-surface-hover);
        }
      `}
      onClick={() => handleBankAccountSelect(bankAccount)}
    >
      <img
        src={getBankIcon(bankAccount.spei_institution_code)}
        alt={`Bank ${bankAccount.spei_institution_code}`}
        css={css`
          width: 48px;
          height: 48px;
          border-radius: var(--border-radius-small);
          object-fit: cover;
          flex-shrink: 0;
        `}
      />
      <div
        css={css`
          flex: 1;
          min-width: 0;
        `}
      >
        <p
          css={css`
            font-weight: var(--fw-semibold);
            color: var(--clr-text);
            font-size: var(--text-base);
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `}
        >
          {bankAccount.name}
        </p>
        <p
          css={css`
            font-size: var(--text-sm);
            color: var(--clr-text-muted);
            margin: 0;
            margin-top: var(--size-50);
          `}
        >
          {"..." + bankAccount.spei_clabe?.slice(-4)}
        </p>
      </div>
    </div>
  );

  const renderAmountStep = () => (
    <div
      css={css`
        display: grid;
        grid-template-rows: 1fr auto;
        gap: var(--size-200);
        padding-block-end: var(--size-200);
        height: 100cqh;
      `}
    >
      <section>
        <div
          css={css`
            display: grid;
            height: 100%;
            place-items: center;
            isolation: isolate;
            position: relative;
          `}
        ></div>
      </section>
      <div
        css={css`
          display: grid;
          grid-template-rows: auto auto auto;
          gap: var(--size-200);
        `}
      >
        <section
          css={css`
            padding-inline: var(--size-250);
          `}
        ></section>

        <section
          css={css`
            padding-inline: var(--size-200);
          `}
        >
          <Button
            expand
            variant="primary"
            onPress={handleNextButtonPress}
            isDisabled={isSendDisabled || isLoading}
          >
            Next
          </Button>
        </section>
      </div>
    </div>
  );

  const renderBankAccountStep = () => (
    <div
      css={css`
        display: grid;
        grid-template-rows: 1fr auto;
        gap: var(--size-200);
        padding-block-end: var(--size-200);
        height: 100cqh;
      `}
    >
      <section
        css={css`
          padding-inline: var(--size-200);
          overflow-y: auto;
        `}
      >
        {isLoadingBankAccounts ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60%",
            }}
          >
            <div
              css={css`
                width: 12rem;
                height: 12rem;
              `}
            ></div>
          </div>
        ) : (
          <div
            css={css`
              display: grid;
              gap: var(--size-150);
              margin-top: var(--size-200);
            `}
          >
            {bankAccounts.map(renderBankAccountCard)}

            {/* Create New Bank Account Button */}
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-150);
                padding: var(--size-200);
                border-radius: var(--border-radius-medium);
                background-color: var(--clr-surface-raised);
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.2s ease;
                &:hover {
                  background-color: var(--clr-surface-hover);
                }
              `}
              onClick={handleCreateNewBankAccount}
            >
              <div
                css={css`
                  width: 48px;
                  height: 48px;
                  border-radius: var(--border-radius-small);
                  background-color: var(--clr-primary);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                `}
              >
                <Plus size={24} color="white" weight="bold" />
              </div>
              <div
                css={css`
                  flex: 1;
                  min-width: 0;
                `}
              >
                <p
                  css={css`
                    font-weight: var(--fw-semibold);
                    color: var(--clr-text);
                    font-size: var(--text-base);
                    margin: 0;
                  `}
                >
                  Add Bank Account
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section
        css={css`
          padding-inline: var(--size-200);
        `}
      >
        <Button
          expand
          variant="primary"
          onPress={handleNextButtonPress}
          isDisabled={!selectedBankAccount || isLoading}
        >
          {isLoading ? "Processing..." : "Next"}
        </Button>
      </section>
    </div>
  );

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentStep("amount");
            setSelectedBankAccount(null);
            setSelectedBank(null);
            setShowBankPickerOverlay(false);
            setShowBankInputOverlay(false);
            setShowAmountInputOverlay(false);
          }
          onOpenChange(open);
        }}
        title="Withdraw"
      >
        {blindPayReceiverId && blindPayEvmWalletId ? (
          !showAmountInputOverlay ? (
            renderBankAccountStep()
          ) : null
        ) : (
          <div
            css={css`
              display: grid;
              grid-template-rows: 1fr auto;
              gap: var(--size-200);
              padding-block-end: var(--size-200);
              height: 100cqh;
            `}
          >
            <section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <p style={{ textAlign: "center" }}>
                  Error verifying your account. Please contact support:
                  gavin@myfye.com
                </p>
              </div>
            </section>
          </div>
        )}
      </Overlay>
      {showAmountInputOverlay && (
        <AmountInputOverlay
          isOpen={showAmountInputOverlay}
          onOpenChange={(open) => {
            setShowAmountInputOverlay(open);
            if (!open) {
              // If closed, return to bank account step
              setShowAmountInputOverlay(false);
            }
          }}
          onBack={() => setShowAmountInputOverlay(false)}
          selectedBankAccount={selectedBankAccount}
          selectedCurrency={selectedCurrency}
        />
      )}
      <BankPickerOverlay
        isOpen={showBankPickerOverlay}
        onOpenChange={setShowBankPickerOverlay}
        onBankSelect={handleBankSelect}
        selectedBankCode={selectedBank?.code}
      />

      {selectedBank && (
        <BankInputOverlay
          isOpen={showBankInputOverlay}
          onOpenChange={setShowBankInputOverlay}
          selectedBank={selectedBank}
          onBankAccountCreated={handleBankAccountCreated}
          onBack={handleBankInputBack}
        />
      )}
    </>
  );
};

export default OffChainWithdrawOverlay;
