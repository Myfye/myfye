import { css } from "@emotion/react";
import Overlay, {
  LocalOverlayProps,
} from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import DepositOffChainInstructionsOverlay from "./DepositOffChainInstructionsOverlay";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import AmountSelectorGroup from "@/shared/components/ui/amount-selector/AmountSelectorGroup";
import AmountSelector from "@/shared/components/ui/amount-selector/AmountSelector";
import AmountDisplay from "@/shared/components/ui/amount-display/AmountDisplay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  toggleModal,
  toggleOverlay,
  unmount,
  updateAmount,
  updatePayin,
  updatePresetAmount,
} from "../depositOffChainSlice";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";
import { PresetAmountOption } from "../depositOffChain.types";
import { CaretDown } from "@phosphor-icons/react";
import { currencyMap } from "../_components/currencyMap";
import SelectCurrencyModal from "../SelectCurrencyModal";
import { useLazyCreatePayinQuery } from "../../depositApi";
import toast from "react-hot-toast/headless";

const DepositOffChainBankAccountOverlay = ({
  ...restProps
}: LocalOverlayProps) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.depositOffChain.overlays.depositOffChain.isOpen
  );
  const transaction = useAppSelector(
    (state) => state.depositOffChain.transaction
  );

  const blindPayEvmWalletId = useAppSelector(
    (state) => state.userWalletData.blindPayEvmWalletId
  );

  const userEmail = useAppSelector(
    (state) => state.userWalletData.currentUserEmail
  );

  const numberPadProps = useNumberPad({
    onStartDelete: (input) => {
      dispatch(updateAmount({ input }));
    },
    onUpdateAmount: (input) => {
      dispatch(updateAmount({ input }));
    },
    onUpdatePresetAmount: (presetAmount) => {
      dispatch(updatePresetAmount(presetAmount));
    },
    formattedAmount: transaction.formattedAmount,
  });

  const currency = currencyMap.currencies[transaction.payin.currency];
  const CurrencyIcon = currency.icon;

  const [payinTrigger, { isLoading, isError, isSuccess }] =
    useLazyCreatePayinQuery();

  const handleNext = async () => {
    if (!transaction.amount) return;
    const { data, isError } = await payinTrigger({
      amount: transaction.amount,
      blindPayEvmWalletId: blindPayEvmWalletId,
      currency: transaction.payin.currency.toUpperCase(),
      email: userEmail,
    });
    if (isError || !data)
      return toast.error("Error creating Payin. Please try again");
    dispatch(
      updatePayin({
        currency: data?.currency.toLowerCase(),
        pixAddress: data?.pix_code,
        clabeAddress: data?.clabe,
        senderAmount: data?.sender_amount,
        achAccountNumber: data?.blindpay_bank_details.account_number,
        achRoutingNumber: data?.blindpay_bank_details.routing_number,
        beneficiary: {
          name: data?.blindpay_bank_details.beneficiary.name,
          addressLine1: data?.blindpay_bank_details.beneficiary.address_line_1,
          addressLine2: data?.blindpay_bank_details.beneficiary.address_line_2,
        },
      })
    );
    dispatch(toggleOverlay({ type: "instructions", isOpen: true }));
  };

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "depositOffChain", isOpen }));
        }}
        title="Amount"
        zIndex={2000}
        onExit={() => {
          dispatch(unmount());
        }}
      >
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
              <section
                css={css`
                  position: relative;
                `}
              >
                <AmountDisplay
                  amount={transaction.formattedAmount}
                  fiatCurrency={transaction.payin.currency}
                >
                  {transaction.fee !== 0 && transaction.fee && (
                    <div
                      css={css`
                        position: absolute;
                        top: calc(100% + var(--size-100));
                        width: 100cqw;
                        text-align: center;
                      `}
                    >
                      <span
                        css={css`
                          font-size: var(--fs-medium);
                          color: var(--clr-text-weak);
                          width: 100%;
                        `}
                      >
                        +{" "}
                        {new Intl.NumberFormat("en-En", {
                          currency: transaction.payin.currency,
                          style: "currency",
                        }).format(transaction.fee)}{" "}
                        fee
                      </span>
                    </div>
                  )}
                </AmountDisplay>
              </section>
            </div>
          </section>
          <div
            css={css`
              display: grid;
              grid-template-rows: auto auto auto auto;
              gap: var(--size-200);
            `}
          >
            <section
              css={css`
                margin-inline: auto;
              `}
            >
              <Button
                color="neutral"
                size="small"
                iconRight={CaretDown}
                onPress={() => {
                  dispatch(
                    toggleModal({ type: "selectCurrency", isOpen: true })
                  );
                }}
              >
                <CurrencyIcon width={20} height={20} />
                {transaction.payin.currency?.toUpperCase()}
              </Button>
            </section>
            <section
              css={css`
                padding-inline: var(--size-200);
                margin-inline: auto;
              `}
            >
              <AmountSelectorGroup
                label="Select preset amount"
                onChange={(presetAmount) => {
                  dispatch(
                    updatePresetAmount(presetAmount as PresetAmountOption)
                  );
                  dispatch(
                    updateAmount({
                      input: presetAmount,
                      replace: true,
                    })
                  );
                }}
              >
                <AmountSelector value="500">
                  ${transaction.payin.currency === "mxn" ? 500 : 250}
                </AmountSelector>
                <AmountSelector value="1000">
                  ${transaction.payin.currency === "mxn" ? "1,000" : "500"}
                </AmountSelector>
                <AmountSelector value="5000">
                  ${transaction.payin.currency === "mxn" ? "5,000" : "2,500"}
                </AmountSelector>
                <AmountSelector value="10000">
                  ${transaction.payin.currency === "mxn" ? "10,000" : "5,000"}
                </AmountSelector>
              </AmountSelectorGroup>
            </section>
            <section
              css={css`
                padding-inline: var(--size-250);
              `}
            >
              <NumberPad {...numberPadProps} />
            </section>
            <section
              css={css`
                padding-inline: var(--size-200);
              `}
            >
              <Button
                expand
                variant="primary"
                onPress={handleNext}
                isLoading={isLoading}
                isDisabled={transaction.amount === 0}
              >
                Next
              </Button>
            </section>
          </div>
        </div>
      </Overlay>
      <DepositOffChainInstructionsOverlay />
      <SelectCurrencyModal />
    </>
  );
};

export default DepositOffChainBankAccountOverlay;
