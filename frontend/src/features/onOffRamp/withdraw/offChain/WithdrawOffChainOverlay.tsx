import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay, {
  LocalOverlayProps,
  OverlayProps,
} from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { Bank, Plus } from "@phosphor-icons/react";
import { RootState } from "@/redux/store";
import { useGetUserBankAccountsQuery } from "@/features/users/usersApi";
import { toggleOverlay } from "./withdrawOffChainSlice";
import WithdrawOffChainBankPickerOverlay from "./WithdrawOffChainBankPickerOverlay";
import WithdrawOffChainBankInputOverlay from "./WithdrawOffChainBankInputOverlay";
import WithdrawOffChainSelectAmountOverlay from "./WithdrawOffChainSelectAmountOverlay.tsx";
import WithdrawOffChainSelectAssetOverlay from "./WithdrawOffChainSelectAssetOverlay.tsx";
import NoBankScreen from "./_components/NoBankScreen.tsx";

const WithdrawOffChainOverlay = ({ ...restProps }: LocalOverlayProps) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) =>
      state.withdrawOffChain.overlays.withdrawOffChain.isOpen
  );

  const userEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const userId = useSelector(
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

  const {
    isError,
    isLoading,
    isSuccess,
    data: bankAccounts,
  } = useGetUserBankAccountsQuery(userId);

  // const handleNextButtonPress = async () => {
  //   if (selectedBankAccount && !showAmountInputOverlay) {
  //     setShowAmountInputOverlay(true);
  //   } else {
  //   }
  // };

  // const handleBankAccountSelect = (bankAccount) => {
  //   console.log("Bank account selected:", bankAccount);
  //   setSelectedBankAccount(bankAccount);
  // };

  // const handleCreateNewBankAccount = () => {
  //   setShowBankPickerOverlay(true);
  // };

  // const handleBankAccountCreated = (newBankAccount) => {
  //   // Refresh bank accounts list
  //   // fetchBankAccounts().then(() => {
  //   //   if (newBankAccount) {
  //   //     setSelectedBankAccount(newBankAccount);
  //   //   }
  //   // });
  //   setShowBankInputOverlay(false);
  //   setShowBankPickerOverlay(false);
  // };

  // const handleBankInputBack = () => {
  //   setShowBankInputOverlay(false);
  //   setShowBankPickerOverlay(true);
  // };

  // const handleBankSelect = (bankInfo) => {
  //   console.log("Bank selected from picker:", bankInfo);
  //   setSelectedBank(bankInfo);
  //   setShowBankInputOverlay(true);
  // };

  // const renderBankAccountCard = (bankAccount) => (
  //   <div
  //     key={bankAccount.id}
  //     css={css`
  //       display: flex;
  //       align-items: center;
  //       gap: var(--size-150);
  //       padding: var(--size-200);
  //       border-radius: var(--border-radius-medium);
  //       background-color: var(--clr-surface-raised);
  //       border: 2px solid
  //         ${selectedBankAccount?.id === bankAccount.id
  //           ? "var(--clr-primary)"
  //           : "transparent"};
  //       cursor: pointer;
  //       transition: all 0.2s ease;
  //       &:hover {
  //         background-color: var(--clr-surface-hover);
  //       }
  //     `}
  //     onClick={() => handleBankAccountSelect(bankAccount)}
  //   >
  //     <img
  //       src={getBankIcon(bankAccount.spei_institution_code)}
  //       alt={`Bank ${bankAccount.spei_institution_code}`}
  //       css={css`
  //         width: 48px;
  //         height: 48px;
  //         border-radius: var(--border-radius-small);
  //         object-fit: cover;
  //         flex-shrink: 0;
  //       `}
  //     />
  //     <div
  //       css={css`
  //         flex: 1;
  //         min-width: 0;
  //       `}
  //     >
  //       <p
  //         css={css`
  //           font-weight: var(--fw-semibold);
  //           color: var(--clr-text);
  //           font-size: var(--text-base);
  //           margin: 0;
  //           white-space: nowrap;
  //           overflow: hidden;
  //           text-overflow: ellipsis;
  //         `}
  //       >
  //         {bankAccount.name}
  //       </p>
  //       <p
  //         css={css`
  //           font-size: var(--text-sm);
  //           color: var(--clr-text-muted);
  //           margin: 0;
  //           margin-top: var(--size-50);
  //         `}
  //       >
  //         {"..." + bankAccount.spei_clabe?.slice(-4)}
  //       </p>
  //     </div>
  //   </div>
  // );

  // const renderBankAccountStep = () => (
  //   <div
  //     css={css`
  //       display: grid;
  //       grid-template-rows: 1fr auto;
  //       gap: var(--size-200);
  //       padding-block-end: var(--size-200);
  //       height: 100cqh;
  //     `}
  //   >
  //     <section
  //       css={css`
  //         padding-inline: var(--size-200);
  //         overflow-y: auto;
  //       `}
  //     >
  //       {isLoadingBankAccounts ? (
  //         <div
  //           style={{
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             height: "60%",
  //           }}
  //         >
  //           <div
  //             css={css`
  //               width: 12rem;
  //               height: 12rem;
  //             `}
  //           ></div>
  //         </div>
  //       ) : (
  //         <div
  //           css={css`
  //             display: grid;
  //             gap: var(--size-150);
  //             margin-top: var(--size-200);
  //           `}
  //         >
  //           {bankAccounts.map(renderBankAccountCard)}

  //           {/* Create New Bank Account Button */}
  //           <div
  //             css={css`
  //               display: flex;
  //               align-items: center;
  //               gap: var(--size-150);
  //               padding: var(--size-200);
  //               border-radius: var(--border-radius-medium);
  //               background-color: var(--clr-surface-raised);
  //               border: 2px solid transparent;
  //               cursor: pointer;
  //               transition: all 0.2s ease;
  //               &:hover {
  //                 background-color: var(--clr-surface-hover);
  //               }
  //             `}
  //             onClick={handleCreateNewBankAccount}
  //           >
  //             <div
  //               css={css`
  //                 width: 48px;
  //                 height: 48px;
  //                 border-radius: var(--border-radius-small);
  //                 background-color: var(--clr-primary);
  //                 display: flex;
  //                 align-items: center;
  //                 justify-content: center;
  //                 flex-shrink: 0;
  //               `}
  //             >
  //               <Plus size={24} color="white" weight="bold" />
  //             </div>
  //             <div
  //               css={css`
  //                 flex: 1;
  //                 min-width: 0;
  //               `}
  //             >
  //               <p
  //                 css={css`
  //                   font-weight: var(--fw-semibold);
  //                   color: var(--clr-text);
  //                   font-size: var(--text-base);
  //                   margin: 0;
  //                 `}
  //               >
  //                 Add Bank Account
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </section>

  //     <section
  //       css={css`
  //         padding-inline: var(--size-200);
  //       `}
  //     >
  //       <Button
  //         expand
  //         variant="primary"
  //         onPress={handleNextButtonPress}
  //         isDisabled={!selectedBankAccount || isLoading}
  //       >
  //         {isLoading ? "Processing..." : "Next"}
  //       </Button>
  //     </section>
  //   </div>
  // );

  return (
    <>
      <Overlay
        {...restProps}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "withdrawOffChain", isOpen }));
        }}
        title="Withdraw to bank account"
        zIndex={2000}
      >
        <div
          css={css`
            height: 100cqh;
          `}
        >
          {Array.isArray(bankAccounts) ? (
            bankAccounts?.map((account) => (
              <Button
                onPress={() => {
                  // open select amount overlay
                }}
              >
                {account.blind_pay_details?.spei_institution_code}
              </Button>
            ))
          ) : (
            <NoBankScreen />
          )}
        </div>
        {/* <div
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
              align-content: center;
            `}
          >
            <p
              css={css`
                text-align: center;
                line-height: var(--line-height-caption);
              `}
            >
              Error verifying your account. <br />
              Please contact support: gavin@myfye.com
            </p>
          </section>
        </div> */}
      </Overlay>
      {/* {showAmountInputOverlay && (
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
      )}*/}
      <WithdrawOffChainSelectAmountOverlay />
      <WithdrawOffChainBankPickerOverlay />
      <WithdrawOffChainBankInputOverlay />
      <WithdrawOffChainSelectAssetOverlay zIndex={9999} />
      {/* {selectedBank && (
        <BankInputOverlay
          isOpen={showBankInputOverlay}
          onOpenChange={setShowBankInputOverlay}
          selectedBank={selectedBank}
          onBankAccountCreated={handleBankAccountCreated}
          onBack={handleBankInputBack}
        />
      )} */}
    </>
  );
};

export default WithdrawOffChainOverlay;
