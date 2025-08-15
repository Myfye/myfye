import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch } from "react-redux";
import {
  truncateSolanaAddress,
  validateSolanaAddress,
} from "@/shared/utils/solanaUtils";
import { useGetRecentlyUsedAddressesQuery } from "@/features/solana/solanaApi";
import { toggleOverlay, updateSolAddress } from "./withdrawOnChainSlice";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast/headless";
import TextInput from "@/shared/components/ui/inputs/TextInput";
import { Button as AriaButton } from "react-aria-components";
import IconCard from "@/shared/components/ui/card/IconCard";
import Section from "@/shared/components/ui/section/Section";
import SearchField from "@/features/users/SearchField";
import QRScanner from "@/features/qr-code/QRScanner";
import RecentlyUsedAddressesList from "./_components/RecentlyUsedAddresses";

interface WithdrawOnChainAddressEntryOverlayProps
  extends Omit<OverlayProps, "children" | "isOpen" | "onOpenChange"> {}

const WithdrawOnChainAddressEntryOverlay = ({
  ...restProps
}: WithdrawOnChainAddressEntryOverlayProps) => {
  const dispatch = useDispatch();
  const isOpen = useAppSelector(
    (state) => state.withdrawOnChain.overlays.addressEntry.isOpen
  );
  const transaction = useAppSelector(
    (state) => state.withdrawOnChain.transaction
  );
  const [solAddress, setSolAddress] = useState("");

  const userId = useAppSelector((state) => state.userWalletData.currentUserID);

  const [isQRScannerOpen, setQRScannerOpen] = useState(false);

  return (
    <>
      <Overlay
        {...restProps}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "addressEntry", isOpen }));
          setSolAddress("");
        }}
        zIndex={2002}
        direction="vertical"
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr auto;
            gap: var(--size-200);
            height: 100%;
          `}
        >
          <section
            css={css`
              padding-inline: var(--size-400);
            `}
          >
            <div
              css={css`
                padding-block-start: var(--size-300);
              `}
            >
              <h1
                className="heading-x-large"
                css={css`
                  text-align: center;
                `}
              >
                Enter Solana Address
              </h1>
              <p
                className="caption"
                css={css`
                  text-align: center;
                  color: var(--clr-text-weak);
                  margin-block-start: var(--size-100);
                `}
              >
                Enter a valid solana address in the field below
              </p>
            </div>
            <div
              css={css`
                margin-block-start: var(--size-400);
              `}
            >
              <SearchField
                label="Enter solana address"
                type="text"
                value={solAddress}
                onScanTogglerPress={() => setQRScannerOpen(true)}
                onChange={(e) => {
                  setSolAddress(e);
                }}
                placeholder="Solana address"
              />
            </div>
            {solAddress && (
              <menu
                css={css`
                  margin-block-start: var(--size-400);
                `}
              >
                <li>
                  <AriaButton
                    onPress={() => {
                      if (!validateSolanaAddress(solAddress))
                        return toast.error(
                          "Please enter a valid Solana address"
                        );

                      dispatch(updateSolAddress(solAddress));
                      dispatch(
                        toggleOverlay({
                          type: "addressEntry",
                          isOpen: false,
                        })
                      );
                      setSolAddress("");
                      toast.success(
                        `Using wallet ${truncateSolanaAddress(solAddress)}`
                      );
                    }}
                    css={css`
                      width: 100%;
                    `}
                  >
                    <IconCard
                      icon="wallet"
                      leftContent={{
                        title: truncateSolanaAddress(solAddress),
                        align: "center",
                      }}
                      isActive={solAddress === transaction.solAddress}
                      showPlus={solAddress !== transaction.solAddress}
                    />
                  </AriaButton>
                </li>
              </menu>
            )}
            {!solAddress && (
              <RecentlyUsedAddressesList
                userId={userId}
                currentAddress={transaction.solAddress}
              />
            )}
          </section>
        </div>
      </Overlay>
      <QRScanner
        isOpen={isQRScannerOpen}
        onOpenChange={(isOpen) => setQRScannerOpen(isOpen)}
        onScanSuccess={(data) => {
          const { data: address } = data;
          if (!validateSolanaAddress(address)) {
            toast.error("Invalid solana address. Please try again.");
          } else {
            setSolAddress(address);
          }
        }}
        onScanFail={(e) => {}}
        zIndex={2001}
      />
    </>
  );
};

export default WithdrawOnChainAddressEntryOverlay;
