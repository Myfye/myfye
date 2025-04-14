import NumberPad from "@/components/ui/number-pad/NumberPad";
import PrivyUseSolanaWallets from "../../components/PrivyUseSolanaWallets";
import HomeTabs from "@/features/home/HomeTabs";

import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import SelectContactOverlay from "./SelectContactOverlay";
import { RootState } from "@/redux/store";
import { useMemo } from "react";

const Pay = () => {
  const dispatch = useDispatch();

  const formattedAmount = useSelector(
    (state: RootState) => state.pay.transaction.formattedAmount
  );

  const formattedAmountArray = useMemo(
    () => formattedAmount.split(""),
    [formattedAmount]
  );

  const handleRequest = () => {
    // dispatch(toggleRequestOverlay({ type: "selectContact", isOpen: true }));
  };

  const handlePay = () => {
    // dispatch(toggleSendOverlay({ type: "selectContact", isOpen: true }));
  };

  return (
    <>
      <div
        className="pay"
        css={css`
          height: 100cqh;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
            padding-block-end: var(--size-250);
          `}
        >
          {/* <PayController /> */}
          <section>
            <div>
              <span>$</span>
              {...formattedAmountArray.map((val) => <span>{val}</span>)}
            </div>
          </section>
          <section
            css={css`
              margin-block-start: auto;
              margin-block-end: var(--size-400);
            `}
          >
            <NumberPad></NumberPad>
          </section>
          <section
            css={css`
              padding-inline: var(--size-250);
            `}
          >
            <menu
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--controls-gap-medium);
              `}
            >
              <li>
                <Button expand onPress={handleRequest}>
                  Request
                </Button>
              </li>
              <li>
                <Button expand onPress={handlePay}>
                  Pay
                </Button>
              </li>
            </menu>
          </section>
        </div>
      </div>
      {/* <RequestOverlay />
      <SendOverlay /> */}
    </>
  );
};

export default Pay;
