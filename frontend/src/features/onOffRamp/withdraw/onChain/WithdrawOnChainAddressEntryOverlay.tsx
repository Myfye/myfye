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
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast/headless";

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
    (state) => state.withdrawOnChain.overlays.addressEntry.isOpen
  );
  const solAddress = useAppSelector(
    (state) => state.withdrawOnChain.transaction.solAddress
  );

  const userId = useAppSelector((state) => state.userWalletData.currentUserID);

  const {
    isSuccess,
    isLoading: areRecentlyUsedAddressesLoading,
    isError: areRecentlyUsedAddressesError,
    data: recentlyUsedAddresses,
  } = useGetRecentlyUsedAddressesQuery(userId);

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
        zIndex={2002}
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
                margin-block-start: var(--size-300);
              `}
            >
              <h1 className="heading-x-large">Enter Solana Address</h1>
            </div>
            <div
              css={css`
                margin-block-start: var(--size-400);
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
            {/* {recentlyUsedAddresses?.addresses &&
              Array.isArray(recentlyUsedAddresses?.addresses) && (
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
                    {/* {recentAddresses.addresses.map((addr, index) => (
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
                    ))} */}
            {/* </div>
                </div> */}
            {/* )} */}
          </section>
          <section
            css={css`
              margin-block-start: auto;
              padding-inline: var(--size-400);
              padding-block-end: var(--size-200);
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={() => {
                const isSolanaAddressValid = validateSolanaAddress(
                  solAddress ?? ""
                );
                if (!isSolanaAddressValid)
                  return toast.error("Please input a valid Solana address");
                dispatch(toggleOverlay({ type: "confirmTransaction", isOpen }));
              }}
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
