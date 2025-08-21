import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useGetUserBankAccountsQuery } from "@/features/users/usersApi";
import { 
  toggleOverlay, 
  updateBankInfo, 
  setBankAccountsLoading, 
  setBankAccountsError, 
  setBankAccounts,
  clearBankAccounts
} from "./withdrawOffChainSlice.ts";
import { BankAccountResponse } from "./withdrawOffChain.types";
import NoBankScreen from "./_components/NoBankScreen.tsx";
import { useAppSelector } from "@/redux/hooks.tsx";
import RingLoader from "@/shared/components/ui/loading/spinners/RingLoader.tsx";
import { PlusIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button as AriaButton } from "react-aria-components";
import IconCard from "@/shared/components/ui/card/IconCard.tsx";
import truncateBankAccountNumber from "@/shared/utils/bankUtils.ts";
import { useEffect } from "react";

const WithdrawOffChainSelectBankOverlay = () => {
  const dispatch = useDispatch();
  const isOpen = useAppSelector(
    (state) => state.withdrawOffChain.overlays.selectBank.isOpen
  );

  const userEmail = useAppSelector(
    (state) => state.userWalletData.currentUserEmail
  );
  const userId = useAppSelector((state) => state.userWalletData.currentUserID);
  const blindPayEvmWalletId = useAppSelector(
    (state) => state.userWalletData.blindPayEvmWalletId
  );
  const blindPayReceiverId = useAppSelector(
    (state) => state.userWalletData.blindPayReceiverId
  );

  /* Public keys */
  const solanaPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );

  const overlayProps = {
    isOpen,
    onOpenChange: (isOpen: boolean) => {
      dispatch(toggleOverlay({ type: "selectBank", isOpen }));
    },
    title: "Select bank",
    zIndex: 2000,
    direction: "vertical",
  };

  // Get bank accounts from Redux state
  const bankAccounts = useAppSelector((state) => state.withdrawOffChain.bankAccounts);
  
  // Use RTK Query to fetch bank accounts and sync with Redux state
  const {
    isError,
    isLoading,
    isSuccess,
    data: bankAccountsData,
    refetch,
    error,
  } = useGetUserBankAccountsQuery(userId, {
    skip: bankAccounts.data.length > 0, // Skip if we already have data
  });

  // Sync RTK Query data with Redux state
  useEffect(() => {
    if (isLoading) {
      dispatch(setBankAccountsLoading(true));
    } else if (isError) {
      dispatch(setBankAccountsLoading(false));
      dispatch(setBankAccountsError(true));
    } else if (isSuccess && bankAccountsData) {
      console.log('Processing bank accounts data:', bankAccountsData);
      console.log('Data type:', typeof bankAccountsData);
      console.log('Is array:', Array.isArray(bankAccountsData));
      
      // Handle the response structure - it should have success, data, and message
      let accountsArray: BankAccountResponse[] = [];
      
      if (bankAccountsData && typeof bankAccountsData === 'object' && 'success' in bankAccountsData) {
        if (bankAccountsData.success && bankAccountsData.data) {
          accountsArray = Array.isArray(bankAccountsData.data) ? bankAccountsData.data : [];
        }
      }
      
      console.log('Processed accounts array:', accountsArray);
      
      // Debug each account to see the structure
      accountsArray.forEach((account, index) => {
        console.log(`Account ${index}:`, account);
      });
      
      // Transform the data to match our BankAccount interface
      const transformedData = accountsArray
        .filter((account: BankAccountResponse) => {
          const hasValidData = account.id && account.name && account.spei_clabe;
          if (!hasValidData) {
            console.log('Filtering out account with invalid data:', account);
          }
          return hasValidData;
        })
        .map((account: BankAccountResponse) => ({
          id: account.id,
          name: account.name,
          beneficiary_name: account.beneficiary_name,
          spei_institution_code: account.spei_institution_code,
          spei_clabe: account.spei_clabe,
        }));
      
      console.log('Transformed data:', transformedData);
      dispatch(setBankAccounts(transformedData));
    }
  }, [isLoading, isError, isSuccess, bankAccountsData, dispatch]);

  // Clear bank accounts when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearBankAccounts());
    };
  }, [dispatch]);

  // Log state for debugging
  console.log('WithdrawOffChainSelectBankOverlay State:', {
    reduxBankAccounts: bankAccounts,
    rtkQueryState: { isError, isLoading, isSuccess },
    rtkQueryData: bankAccountsData,
    userId,
    bankAccountsCount: bankAccounts.data.length,
  });

  if (bankAccounts.isError) {
    // Log detailed error information for debugging
    console.error('WithdrawOffChainSelectBankOverlay Error Details:', {
      reduxError: bankAccounts.isError,
      rtkQueryError: isError,
      userId,
      bankAccountsData,
    });

    return (
      <>
        <Overlay {...overlayProps}>
          <div
            css={css`
              display: grid;
              place-items: center;
              height: 100cqh;
              padding-inline: var(--size-400);
            `}
          >
            <section
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
            >
              <WarningCircleIcon
                color="var(--clr-red-500)"
                size={64}
                css={css`
                  margin-block-end: var(--size-200);
                `}
              />
              <div
                css={css`
                  margin-block-end: var(--size-500);
                `}
              >
                <h1
                  className="heading-large"
                  css={css`
                    text-align: center;
                  `}
                >
                  Oh no!
                </h1>
                <p
                  className="caption"
                  css={css`
                    margin-block-start: var(--size-150);
                    color: var(--clr-text-weak);
                    text-align: center;
                  `}
                >
                  We're having trouble getting your bank accounts. Please try
                  again.
                </p>
              </div>
              <Button onPress={() => {
                dispatch(setBankAccountsLoading(true));
                dispatch(setBankAccountsError(false));
                refetch();
              }} isLoading={bankAccounts.isLoading} expand>
                Retry
              </Button>
            </section>
          </div>
        </Overlay>
      </>
    );
  }

  if (bankAccounts.isLoading) {
    return (
      <>
        <Overlay {...overlayProps}>
          <div
            css={css`
              display: grid;
              place-items: center;
              height: 100cqh;
            `}
          >
            <RingLoader width={32} height={32} />
          </div>
        </Overlay>
      </>
    );
  }

  if (bankAccounts.data.length === 0) {
    return (
      <>
        <Overlay {...overlayProps}>
          <div
            css={css`
              height: 100cqh;
            `}
          >
            <NoBankScreen />
          </div>
        </Overlay>
      </>
    );
  }

  return (
    <>
      <Overlay {...overlayProps}>
        <div
          css={css`
            height: 100cqh;
          `}
        >
          <section
            css={css`
              padding-block-start: var(--size-400);
              padding-inline: var(--size-400);
            `}
          >
            <menu>
              {bankAccounts.data.map((account) => {
                return (
                  <li key={account.id}>
                    <AriaButton
                      css={css`
                        width: 100%;
                      `}
                      onPress={() => {
                        console.log(account);
                        dispatch(
                          updateBankInfo({
                            id: account.id,
                            accountName: account.name,
                            beneficiaryName: account.beneficiary_name,
                            code: account.spei_institution_code,
                            speiClabe: account.spei_clabe,
                          })
                        );
                        dispatch(
                          toggleOverlay({ type: "selectBank", isOpen: false })
                        );
                      }}
                    >
                      <IconCard
                        icon="bank_neutral"
                        leftContent={{
                          title: account.name,
                          subtitle: truncateBankAccountNumber(
                            account.spei_clabe
                          ),
                        }}
                      />
                    </AriaButton>
                  </li>
                );
              })}
              <li
                css={css`
                  display: grid;
                  place-items: center;
                  margin-block-start: var(--size-200);
                `}
              >
                <Button
                  icon={PlusIcon}
                  variant="ghost"
                  onPress={() => {
                    dispatch(
                      toggleOverlay({ type: "bankPicker", isOpen: true })
                    );
                  }}
                >
                  Add a bank account
                </Button>
              </li>
            </menu>
          </section>
        </div>
      </Overlay>
    </>
  );
};

export default WithdrawOffChainSelectBankOverlay;
