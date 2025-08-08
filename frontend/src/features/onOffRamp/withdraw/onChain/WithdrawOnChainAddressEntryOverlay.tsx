import { useState, useEffect, useId } from "react";
import { css } from "@emotion/react";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { RecentSolAddress } from "@/functions/RecentSolAddress";
import Input from "@/shared/components/ui/inputs/Input";
import { validateSolanaAddress } from "@/shared/utils/solanaUtils";
import { RootState } from "@/redux/store";
import { useGetRecentlyUsedAddressesQuery } from "@/features/solana/solanaApi";
import { toggleOverlay, updateSolAddress } from "./withdrawOnChainSlice";

interface WithdrawOnChainAddressEntryOverlayProps
  extends Omit<OverlayProps, "children" | "isOpen" | "onOpenChange"> {
  selectedToken: string;
  amount: string;
}

const WithdrawOnChainAddressEntryOverlay = ({
  selectedToken,
  amount,
  ...restProps
}: WithdrawOnChainAddressEntryOverlayProps) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.withdrawOnChain.overlays.addressEntry.isOpen
  );
  const solAddress = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction.solAddress
  );

  const userId = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );
  const {
    wallets: [wallet],
  } = useSolanaWallets();

  const { isSuccess, isLoading, isError, data } =
    useGetRecentlyUsedAddressesQuery(userId);

  const handleAddressSelect = (selectedAddress: string) => {
    dispatch(updateSolAddress(selectedAddress));
  };

  // const handleSaveAddress = async () => {
  //   try {
  //     await saveSolAddress(userID, address);

  //     // Update local state with the new address
  //     setRecentAddresses((prev) => ({
  //       ...prev,
  //       addresses: prev?.addresses ? [...prev.addresses, address] : [address],
  //     }));
  //   } catch (error) {
  //     console.error("Failed to save recent address:", error);
  //   }
  // };

  return (
    <>
      <Overlay
        {...restProps}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "addressEntry", isOpen }));
        }}
        title="Enter Address"
        zIndex={2002}
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr auto;
            gap: var(--size-200);
            height: 100%;
            padding: var(--size-200);
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-200);
              width: min(100%, 24rem);
              margin-inline: auto;
            `}
          >
            <div
              css={css`
                border-radius: var(--border-radius-medium);
                padding: var(--size-100);
              `}
            >
              <Input
                hideLabel={true}
                label="Enter solana address"
                type="text"
                value={solAddress ?? ""}
                onChange={(e) => {
                  dispatch(updateSolAddress(e.target.value));
                }}
                placeholder="Solana address"
              />
            </div>

            {/* {recentAddresses?.addresses &&
              recentAddresses.addresses.length > 0 && (
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    gap: var(--size-100);
                  `}
                >
                  <div
                    css={css`
                      color: var(--clr-text-secondary);
                      font-size: var(--fs-small);
                      font-weight: 500;
                    `}
                  >
                    My addresses
                  </div>
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      gap: var(--size-100);
                    `}
                  >
                    {recentAddresses.addresses.map((addr, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddressSelect(addr)}
                        css={css`
                          padding: var(--size-100) var(--size-200);
                          border: 1px solid var(--clr-border);
                          border-radius: var(--border-radius-small);
                          background-color: var(--clr-surface-raised);
                          color: var(--clr-text);
                          font-size: 11px;
                          font-family: monospace;
                          text-align: left;
                          cursor: pointer;
                          transition: all 0.2s ease;

                          &:hover {
                            background-color: var(--clr-surface-hover);
                            border-color: var(--clr-primary);
                          }

                          &:active {
                            background-color: var(--clr-surface-active);
                          }
                        `}
                      >
                        {addr}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}
          </div>
          <section
            css={css`
              margin-block-start: auto;
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={() => {
                dispatch(toggleOverlay({ type: "confirmTransaction", isOpen }));
              }}
              isDisabled={validateSolanaAddress("")}
            >
              Next
            </Button>
          </section>
        </div>
      </Overlay>
    </>
  );
};

export default WithdrawOnChainAddressEntryOverlay;
