/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import Balance from "@/components/ui/balance/Balance";
import Button from "@/components/ui/button/Button";
import {
  setReceiveModalOpen,
  setSendModalOpen,
  setSwapModalOpen,
} from "@/redux/modalReducers";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { ReactNode } from "react";

const WalletOverlay = ({
  isOpen,
  onOpenChange,
  balance,
  title,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  balance: number;
  title: string;
  children: ReactNode;
}) => {
  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title={title}>
        {/* {balance === 0 ? (
          <div
            css={css`
              display: grid;
              place-items: center;
              height: 100%;
            `}
          >
            <section>
              <hgroup
                css={css`
                  text-align: center;
                  margin-block-end: var(--size-400);
                `}
              >
                <p className="heading-large">Deposit {title.toLowerCase()}</p>
                <p
                  className="caption-medium"
                  css={css`
                    margin-block-start: var(--size-100);
                    color: var(--clr-text-weak);
                  `}
                >
                  Lorem ipsum dolor
                </p>
              </hgroup>
              <Button onPress={() => {}}>Deposit Crypto</Button>
            </section>
          </div>
        ) : ( */}
        <>
          <section
            className="balance-container"
            css={css`
              margin-block-start: var(--size-150);
            `}
          >
            <div
              className="balance-wrapper"
              css={css`
                padding: 0 var(--size-250);
              `}
            >
              <Balance balance={balance} />
            </div>
            <menu
              className="no-scrollbar"
              css={css`
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: var(--controls-gap-small);
                overflow-x: auto;
                padding: 0 var(--size-250);
                margin-block-start: var(--size-250);
                background-color: var(--clr-surface);
              `}
            >
              <li>
                <Button
                  size="x-small"
                  icon={ArrowCircleUp}
                  onPress={() => {
                    dispatch(setSendModalOpen(true));
                  }}
                >
                  Send
                </Button>
              </li>
              <li>
                <Button
                  size="x-small"
                  icon={ArrowCircleDown}
                  onPress={() => {
                    dispatch(setReceiveModalOpen(true));
                  }}
                >
                  Receive
                </Button>
              </li>
              <li>
                <Button
                  size="x-small"
                  icon={ArrowsLeftRight}
                  onPress={() => {
                    dispatch(setSwapModalOpen(true));
                  }}
                >
                  Swap
                </Button>
              </li>
            </menu>
          </section>
          {children}
        </>
        {/* )} */}
      </Overlay>
    </>
  );
};

export default WalletOverlay;
