import { useState, createContext, useContext, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import mxn from "@/assets/flags/mx.svg";
import brl from "@/assets/flags/br.svg";
import usd from "@/assets/flags/us.svg";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { setWithdrawCryptoOverlayOpen } from "@/redux/overlayReducers";
import { addCurrentCoin } from "@/redux/coinReducer";
import { useRadioGroupState } from "react-stately";
import {
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from "react-aria";
import { selectAsset } from "@/features/assets/assetsSlice";
import Button from "@/shared/components/ui/button/Button";
import { Backspace, CaretUp, CaretDown, CreditCard, Plus } from "@phosphor-icons/react";
import { createPortal } from "react-dom";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../../../../env';
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
  /*
  40002 Banco Nacional de México (Banamex / Citibanamex)
  40012 BBVA México
  40014 Santander México
  40021 HSBC México
  40072 Banorte (Banco Mercantil del Norte)
  */

const OffChainWithdrawOverlay = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("0");
  const [showDepositInstructionsOverlay, setShowDepositInstructionsOverlay] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN"); // MXN BRL USD
  const [payin, setPayin] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);
  const [currentStep, setCurrentStep] = useState('amount'); // 'amount' or 'bankAccount'
  const [showBankPickerOverlay, setShowBankPickerOverlay] = useState(false);
  
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
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
  
  useEffect(() => {
    console.log("blindPayEvmWalletId", blindPayEvmWalletId);
    console.log("blindPayReceiverId", blindPayReceiverId);
    console.log("currentUserID", currentUserID);
  }, [blindPayEvmWalletId, blindPayReceiverId, currentUserID]);
  
  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );
  const isSendDisabled = !formattedAmount || formattedAmount === "0";
  const selectedAddress = solanaPubKey;
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Fetch bank accounts when component mounts
  useEffect(() => {
    if (isOpen && currentUserID) {
      fetchBankAccounts();
    }
  }, [isOpen, currentUserID]);

  const fetchBankAccounts = async () => {
    if (!currentUserID) return;
    
    setIsLoadingBankAccounts(true);
    try {
      const response = await fetch(`${MYFYE_BACKEND}/get_bank_accounts`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({
          user_id: currentUserID,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching bank accounts:', errorData);
        return;
      }

      const result = await response.json();
      console.log('Bank accounts result:', result);
      
      if (result.success && result.data) {
        setBankAccounts(result.data);
        console.log('Bank accounts fetched successfully:', result.data);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('Failed to load bank accounts');
    } finally {
      setIsLoadingBankAccounts(false);
    }
  };

  const getBankIcon = (institutionCode) => {
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
    console.log("handleNextButtonPress");
  };

  const handlePayout = async (amount: number, currency: string, bankAccount: any) => {
    try {
      // For now, this is a placeholder - you'll need to implement the actual payout endpoint
      const response = await fetch(`${MYFYE_BACKEND}/create_payout`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': MYFYE_BACKEND_KEY,
          },
          body: JSON.stringify({
            user_id: currentUserID,
            bank_account_id: bankAccount.id,
            amount: amount,
            currency: currency,
            email: currentUserEmail,
          })
      });

      if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Error creating payout';
          toast.error(errorMessage);
          throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
        console.error("Error in handlePayout:", error);
        if (!error.message || error.message === 'Failed to create payout') {
          toast.error('Error creating payout');
        }
        throw error;
    }
  };

  const handleBankAccountSelect = (bankAccount) => {
    console.log("Bank account selected:", bankAccount);
    setSelectedBankAccount(bankAccount);
  };

  const handleCreateNewBankAccount = () => {
    setShowBankPickerOverlay(true);
  };

  const handleBankSelect = (bankInfo) => {
    console.log("Bank selected from picker:", bankInfo);
    // Here you would typically navigate to a form to create the bank account
    // For now, we'll just show a toast
    toast.info(`Selected ${bankInfo.name}. Bank account creation form coming soon.`);
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
        border: 2px solid ${selectedBankAccount?.id === bankAccount.id ? 'var(--clr-primary)' : 'transparent'};
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
        >
          {isLoading ? (
            <Lottie animationData={leafLoading} loop={true} style={{ width: 400, height: 400 }} />
          ) : (
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-100);
              `}
            >
            </div>
          )}
        </div>
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
        >
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
            disabled={isSendDisabled || isLoading}
            css={css`
              opacity: ${isSendDisabled || isLoading ? 0.5 : 1};
            `}
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
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              height: 200px;
              margin-top: var(--size-200);
            `}
          >
            <Lottie animationData={leafLoading} loop={true} style={{ width: 100, height: 100 }} />
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
                  Create New Bank Account
                </p>
                <p
                  css={css`
                    font-size: var(--text-sm);
                    color: var(--clr-text-muted);
                    margin: 0;
                    margin-top: var(--size-50);
                  `}
                >
                  Add a new bank account for withdrawals
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
          disabled={!selectedBankAccount || isLoading}
          css={css`
            opacity: ${!selectedBankAccount || isLoading ? 0.5 : 1};
          `}
        >
          {isLoading ? 'Processing...' : 'Next'}
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
            setIsDropdownOpen(false);
            setCurrentStep('amount');
            setSelectedBankAccount(null);
          }
          onOpenChange(open);
        }}
        title="Withdraw"
      >
        {(blindPayReceiverId && blindPayEvmWalletId) ? (
          renderBankAccountStep()
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
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <p style={{textAlign: "center"}}>Error verifying your account. Please contact support: gavin@myfye.com</p>
              </div>
            </section>
          </div>
        )}
      </Overlay>

      <BankPickerOverlay
        isOpen={showBankPickerOverlay}
        onOpenChange={setShowBankPickerOverlay}
        onBankSelect={handleBankSelect}
      />
    </>
  );
};

export default OffChainWithdrawOverlay;
