import { css } from "@emotion/react";

import Overlay from "@/shared/components/ui/overlay/Overlay";
import Balance from "@/shared/components/ui/balance/Balance";
import Button from "@/shared/components/ui/button/Button";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { toggleModal as toggleSwapModal } from "../../../../features/swap/swapSlice";
import { AssetGroup } from "../../../../features/assets/types";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "../../../../features/receive/receiveSlice";
import BalanceCard from "@/shared/components/ui/balance/BalanceCard";

const WalletOverlay = ({
  isOpen,
  onOpenChange,
  balance,
  title,
  children,
  groupId,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  balance: number;
  title: string;
  children: ReactNode;
  groupId: AssetGroup["id"];
}) => {
  const dispatch = useDispatch();
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
                    color: var(--clr-text-weaker);
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
              margin-block-start: var(--size-100);
            `}
          >
            <BalanceCard balance={balance} />
            <menu
              className="no-scrollbar"
              css={css`
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: var(--controls-gap-small);
                overflow-x: auto;
                padding: 0 var(--size-250);
                margin-block-start: var(--size-200);
                background-color: var(--clr-surface);
              `}
            >
              <li>
                <Button
                  size="x-small"
                  icon={ArrowCircleUp}
                  onPress={() => {
                    dispatch(toggleSendModal({ isOpen: true }));
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
                    dispatch(toggleReceiveModal(true));
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
                    dispatch(
                      toggleSwapModal({
                        isOpen: true,
                        abstractedAssetId: (() => {
                          switch (groupId) {
                            case "cash": {
                              return "us_dollar";
                            }
                            case "crypto": {
                              return "btc";
                            }
                            case "earn": {
                              return "us_dollar_yield";
                            }
                            case "stocks": {
                              return "APPL";
                            }
                            default: {
                              throw new Error("Invalid group id");
                            }
                          }
                        })(),
                      })
                    );
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
