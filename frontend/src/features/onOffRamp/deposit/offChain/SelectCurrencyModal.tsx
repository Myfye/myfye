import SelectorGroup from "./_components/SelectorGroup";
import Selector from "./_components/Selector";

import { css } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleModal, updatePayin } from "./depositOffChainSlice";
import { currencyArr } from "./_components/currencyMap";
import { CurrencyType } from "./depositOffChain.types";
import Modal from "@/shared/components/ui/modal/Modal";

const SelectCurrencyModal = () => {
  const isOpen = useAppSelector(
    (state) => state.depositOffChain.modals.selectCurrency.isOpen
  );
  const selectedCurrency = useAppSelector(
    (state) => state.depositOffChain.transaction.payin.currency
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        dispatch(toggleModal({ type: "selectCurrency", isOpen }));
      }}
      height={260}
      zIndex={9999}
      title="Choose a currency"
    >
      <section
        css={css`
          padding-inline: var(--size-200);
        `}
      >
        <SelectorGroup
          onChange={(value) => {
            dispatch(updatePayin({ currency: value as CurrencyType }));
            dispatch(toggleModal({ type: "selectCurrency", isOpen: false }));
          }}
          value={selectedCurrency}
        >
          {currencyArr.map((currency) => {
            const Icon = currency.icon;
            return (
              <Selector value={currency.value} key={currency.id}>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    gap: var(--size-100);
                  `}
                >
                  <Icon width={32} height={32} />
                  <span
                    css={css`
                      font-size: var(--fs-medium);
                      line-height: var(--line-height-tight);
                    `}
                  >
                    {currency.label}
                  </span>
                </div>
              </Selector>
            );
          })}
        </SelectorGroup>
      </section>
    </Modal>
  );
};

export default SelectCurrencyModal;
