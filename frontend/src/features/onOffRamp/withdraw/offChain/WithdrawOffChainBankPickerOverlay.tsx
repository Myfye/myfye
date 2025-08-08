import { css } from "@emotion/react";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import BankCardListSelect from "./_components/BankCardListSelect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay, updateBankInfo } from "./withdrawOffChainSlice";
import { bankMap } from "./_components/bankMap";

const banks = bankMap.ids.map((id) => bankMap.banks[id]).filter((v) => !!v);

interface WithdrawOffChainBankPickerOverlayProps extends OverlayProps {}

const WithdrawOffChainBankPickerOverlay = ({
  ...restProps
}: WithdrawOffChainBankPickerOverlayProps) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.withdrawOffChain.overlays.bankPicker.isOpen
  );
  const zIndex = useSelector(
    (state: RootState) => state.withdrawOffChain.overlays.bankPicker.zIndex
  );

  return (
    <>
      <Overlay
        {...restProps}
        isOpen={isOpen}
        onOpenChange={(isOpen) =>
          dispatch(toggleOverlay({ type: "bankPicker", isOpen }))
        }
        zIndex={2001}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
            padding-inline: var(--size-400);
          `}
        >
          <section>
            <h2
              className="heading-x-large"
              css={css`
                margin-block-end: var(--size-400);
                margin-block-start: var(--size-300);
              `}
            >
              Select your bank
            </h2>
            <BankCardListSelect
              //@ts-ignore
              banks={banks}
              onBankSelect={(bankCode) => {
                dispatch(updateBankInfo({ code: bankCode }));
                dispatch(toggleOverlay({ type: "bankInput", isOpen }));
              }}
            />
          </section>
        </div>
      </Overlay>
    </>
  );
};

export default WithdrawOffChainBankPickerOverlay;
