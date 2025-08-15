import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useGetUserBankAccountsQuery } from "@/features/users/usersApi";
import { toggleOverlay, updateBankInfo } from "./withdrawOffChainSlice.ts";
import NoBankScreen from "./_components/NoBankScreen.tsx";
import { useAppSelector } from "@/redux/hooks.tsx";
import RingLoader from "@/shared/components/ui/loading/spinners/RingLoader.tsx";
import { PlusIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button as AriaButton } from "react-aria-components";
import IconCard from "@/shared/components/ui/card/IconCard.tsx";
import truncateBankAccountNumber from "@/shared/utils/bankUtils.ts";

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

  const {
    isError,
    isLoading,
    isSuccess,
    data: bankAccountsData,
    refetch,
  } = useGetUserBankAccountsQuery(userId);

  if (isError || !bankAccountsData || !bankAccountsData?.success) {
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
              <Button onPress={() => refetch()} isLoading={isLoading} expand>
                Retry
              </Button>
            </section>
          </div>
        </Overlay>
      </>
    );
  }

  if (isLoading) {
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

  if (isSuccess && bankAccountsData.length === 0) {
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
              {bankAccountsData.map((account) => {
                return (
                  <li key={account.bank_account_id}>
                    <AriaButton
                      css={css`
                        width: 100%;
                      `}
                      onPress={() => {
                        dispatch(
                          updateBankInfo({
                            id: account.bank_account_id,
                            accountName: account.blind_pay_details?.name,
                            beneficiaryName:
                              account.blind_pay_details?.beneficiary_name,
                            code: account.blind_pay_details
                              ?.spei_institution_code,
                            speiClabe: account.blind_pay_details?.spei_clabe,
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
                          title: account.blind_pay_details?.name ?? "",
                          subtitle: truncateBankAccountNumber(
                            account.blind_pay_details?.spei_clabe ?? ""
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
