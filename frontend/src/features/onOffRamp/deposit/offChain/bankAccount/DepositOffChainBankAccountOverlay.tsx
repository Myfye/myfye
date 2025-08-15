import Overlay from "@/shared/components/ui/overlay/Overlay";
import DepositOffChainInstructionsOverlay from "./DepositOffChainBankAccountInstructionsOverlay";
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
import { currencyMap } from "../_components/currencyMap";
import SelectCurrencyModal from "../SelectCurrencyModal";
import { useLazyCreatePayinQuery } from "../../depositApi";
import toast from "react-hot-toast/headless";
import AmountSelectScreen from "@/shared/components/ui/amount-select-screen/AmountSelectScreen";

const DepositOffChainBankAccountOverlay = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.depositOffChain.overlays.bankAccount.isOpen
  );
  const transaction = useAppSelector(
    (state) => state.depositOffChain.bankAccountTransaction
  );

  const blindPayEvmWalletId = useAppSelector(
    (state) => state.userWalletData.blindPayEvmWalletId
  );

  const userEmail = useAppSelector(
    (state) => state.userWalletData.currentUserEmail
  );

  const numberPadProps = useNumberPad({
    onStartDelete: (input) => {
      dispatch(updateAmount({ input, transactionType: "bankAccount" }));
    },
    onUpdateAmount: (input) => {
      dispatch(updateAmount({ input, transactionType: "bankAccount" }));
    },
    onUpdatePresetAmount: (presetAmount) => {
      dispatch(
        updatePresetAmount({ presetAmount, transactionType: "bankAccount" })
      );
    },
    formattedAmount: transaction.formattedAmount,
  });

  const currency = currencyMap.currencies[transaction.payin.currency];

  const [payinTrigger, { isLoading }] = useLazyCreatePayinQuery();

  const handleNextPress = async () => {
    if (!transaction.amount) return;
    if (!transaction.payin.currency) return;
    console.log(
      transaction.amount,
      blindPayEvmWalletId,
      transaction.payin.currency.toUpperCase(),
      userEmail
    );
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
    dispatch(toggleOverlay({ type: "bankAccountInstructions", isOpen: true }));
  };

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "bankAccount", isOpen }));
        }}
        zIndex={2000}
        onExit={() => {
          dispatch(unmount());
        }}
        title="Deposit amount to bank account"
        hideTitle
      >
        <AmountSelectScreen
          amountDisplayProps={{
            amount: transaction.formattedAmount,
            fiatCurrency: transaction.payin.currency,
            fee: transaction.fee,
          }}
          numberPadProps={numberPadProps}
          amountSelectorGroupProps={{
            label: "Select preset amount",
            onChange: (presetAmount) => {
              dispatch(
                updatePresetAmount({
                  presetAmount,
                  transactionType: "bankAccount",
                })
              );
              dispatch(
                updateAmount({
                  input: presetAmount ?? "0",
                  replace: true,
                  transactionType: "bankAccount",
                })
              );
            },
          }}
          amountSelectors={[
            {
              id: "1",
              label: "$500",
              value: "500",
            },
            {
              id: "2",
              label: "$1,000",
              value: "1000",
            },
            {
              id: "3",
              label: "$5,000",
              value: "5000",
            },
            {
              id: "4",
              label: "$10,000",
              value: "10000",
            },
          ]}
          primaryAction={{
            action: () => {
              dispatch(toggleModal({ type: "selectCurrency", isOpen: true }));
            },
            props: {
              leftContent: {
                title: "Deposit",
                subtitle:
                  transaction.payin.currency === "mxn"
                    ? "Mexican Peso"
                    : "Brazilian Real",
              },
              icon: transaction.payin.currency === "mxn" ? "MXFlag" : "BRFlag",
            },
          }}
          onSubmit={handleNextPress}
          submitLabel={"Get instructions"}
          submitButtonProps={{
            isLoading,
            isDisabled: transaction.amount === 0,
          }}
        />
      </Overlay>
      <DepositOffChainInstructionsOverlay />
      <SelectCurrencyModal />
    </>
  );
};

export default DepositOffChainBankAccountOverlay;
