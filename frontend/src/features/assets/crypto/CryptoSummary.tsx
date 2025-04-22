import Balance from "@/components/ui/balance/Balance";
import solCoinIcon from "@/assets/svgs/coins/sol-coin.svg";

import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import { setDepositModalOpen } from "@/redux/modalReducers";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import Button from "@/components/ui/button/Button";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/send/receiveSlice";

const CryptoSummary = () => {
  const dispatch = useDispatch();
  return (
    <>
      <section
        className="coin"
        css={css`
          padding-inline: var(--size-250);
        `}
      >
        <div
          className="coin-title"
          css={css`
            display: flex;
            align-items: center;
            gap: var(--size-200);
          `}
        >
          <div
            className="coin-icon-wrapper | aspect-ratio-square"
            css={css`
              width: var(--size-600);
            `}
          >
            <img
              src={solCoinIcon}
              alt=""
              css={css`
                width: 100%;
                height: 100%;
                object-fit: cover;
              `}
            />
          </div>
          <p className="heading-x-large">Solana</p>
        </div>
      </section>
      <section
        className="balance"
        css={css`
          margin-block-start: var(--size-250);
          padding-inline: var(--size-250);
        `}
      >
        <Balance balance={123}></Balance>
        <p
          className="caption"
          css={css`
            margin-block-start: var(--size-100);
            color: var(--clr-text-weaker);
          `}
        >
          SOL 1.34
        </p>
      </section>
      <section className="actions">
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
                dispatch(toggleSendModal({ isOpen: true, assetId: "btc" }));
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
              size="small"
              icon={ArrowsLeftRight}
              onPress={() => {
                dispatch(setDepositModalOpen(true));
              }}
            >
              Swap
            </Button>
          </li>
        </menu>
      </section>
    </>
  );
};

export default CryptoSummary;
