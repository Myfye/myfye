import { useId } from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { Button as AriaButton } from "react-aria-components";
import Overlay, {
  LocalOverlayProps,
} from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleOverlay, unmount } from "./depositOffChainSlice";
import { Check, Copy } from "@phosphor-icons/react";
import { useCopyAndPaste } from "@/features/copy-and-paste/useCopyAndPaste";
import BankDepositDetailsList from "./_components/BankDepositDetailsList";
import BankDepositDetailsListItem from "./_components/BankDepositDetailsListItem";
import { toggleModal, unmount as unmountDeposit } from "../depositSlice";

const DepositOffChainInstructionsOverlay = ({
  ...restProps
}: LocalOverlayProps) => {
  const headingId = useId();

  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.depositOffChain.overlays.instructions.isOpen
  );

  const transaction = useAppSelector(
    (state) => state.depositOffChain.transaction
  );
  const payin = useAppSelector(
    (state) => state.depositOffChain.transaction.payin
  );
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );

  return (
    <Overlay
      {...restProps}
      color="var(--clr-surface-raised)"
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        dispatch(toggleOverlay({ type: "instructions", isOpen }));
      }}
      aria-labelledby={headingId}
      zIndex={2001}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          height: 100cqh;
          padding-block-end: var(--size-200);
        `}
      >
        <section
          css={css`
            padding-block-start: var(--size-400);
            padding-inline: var(--size-400);
          `}
        >
          <h1 id={headingId} className="heading-x-large">
            Instructions
          </h1>
          <p
            className="caption"
            css={css`
              color: var(--clr-text-weak);
              margin-block-start: var(--size-150);
            `}
          >
            Copy the following information into your bank's transfer details.
          </p>
          <p
            className="caption"
            css={css`
              color: var(--clr-text-weak);
              margin-block-start: 1em;
            `}
          >
            Information is valid for one (1) hour. We also send an email with
            these instructions.
          </p>
        </section>
        <section
          css={css`
            padding-inline: var(--size-400);
            margin-block-start: var(--size-500);
          `}
        >
          <h2 className="heading-large">Deposit Details</h2>
          <div
            css={css`
              margin-block-start: var(--size-200);
            `}
          >
            <BankDepositDetailsList>
              <BankDepositDetailsListItem
                title="Amount"
                content={
                  payin.senderAmount ? "$" + +payin.senderAmount / 100 + "" : ""
                }
                copyContent={
                  payin.senderAmount ? +payin.senderAmount / 100 + "" : ""
                }
              />
              {payin.currency === "mxn" && (
                <BankDepositDetailsListItem
                  title="Bank name"
                  content="Nvio"
                  copyContent="Nvio"
                />
              )}
              <BankDepositDetailsListItem
                title="Account number"
                content={
                  payin.pixAddress || payin.clabeAddress
                    ? payin.currency === "brl"
                      ? payin.pixAddress
                      : payin.clabeAddress
                    : ""
                }
                copyContent={payin?.beneficiary?.name ?? ""}
              />
              <BankDepositDetailsListItem
                title="Beneficiary name"
                content={payin?.beneficiary?.name ?? ""}
                copyContent={payin?.beneficiary?.name ?? ""}
              />
              <BankDepositDetailsListItem
                title="Beneficiary address line 1"
                content={payin?.beneficiary?.addressLine1 ?? ""}
                copyContent={payin?.beneficiary?.addressLine1 ?? ""}
              />
              <BankDepositDetailsListItem
                title="Beneficiary address line 2"
                content={payin?.beneficiary?.addressLine2 ?? ""}
                copyContent={payin?.beneficiary?.addressLine2 ?? ""}
              />
            </BankDepositDetailsList>
          </div>
          <div
            css={css`
              display: grid;
              place-items: center;
              margin-block-start: var(--size-400);
            `}
          >
            <Button variant="ghost" color="neutral">
              How to use these numbers
            </Button>
          </div>
        </section>
        <section
          css={css`
            margin-block-start: auto;
            padding-inline: var(--size-250);
          `}
        >
          <Button
            expand
            variant="primary"
            onPress={() => {
              dispatch(unmount());
              dispatch(unmountDeposit());
              toggleModal(false);
            }}
          >
            Done
          </Button>
        </section>
      </div>
    </Overlay>
  );
};

export default DepositOffChainInstructionsOverlay;
