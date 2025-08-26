import { useGetRecentlyUsedAddressesQuery } from "@/features/solana/solanaApi";
import { useAppDispatch } from "@/redux/hooks";
import IconCard from "@/shared/components/ui/card/IconCard";
import RingLoader from "@/shared/components/ui/loading/spinners/RingLoader";
import Section from "@/shared/components/ui/section/Section";
import { css } from "@emotion/react";
import { Button as AriaButton } from "react-aria-components";
import { toggleOverlay, updateSolAddress } from "../withdrawOnChainSlice";
import { truncateSolanaAddress } from "@/shared/utils/solanaUtils";
import { CheckIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast/headless";

const RecentlyUsedAddressesList = ({
  userId,
  currentAddress,
}: {
  userId: string;
  currentAddress: string | null;
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, isError, data } = useGetRecentlyUsedAddressesQuery(userId);

  const addresses = [];

  if (currentAddress) {
    addresses.push(currentAddress);
  }

  if (data?.addresses) {
    addresses.push(...data.addresses);
  }

  if (isLoading) {
    return (
      <div>
        <RingLoader />
      </div>
    );
  }

  if (isError || addresses.length === 0) return null;

  return (
    <div
      css={css`
        margin-block-start: var(--size-400);
      `}
    >
      <Section title="Recent Addresses">
        <menu
          css={css`
            display: flex;
            flex-direction: column;
            gap: var(--size-100);
          `}
        >
          {addresses.map((address) => (
            <li key={address}>
              <AriaButton
                onPress={() => {
                  dispatch(updateSolAddress(address));
                  dispatch(
                    toggleOverlay({
                      type: "addressEntry",
                      isOpen: false,
                    })
                  );
                  toast(`Using wallet ${truncateSolanaAddress(address)}`);
                }}
                css={css`
                  display: block;
                  width: 100%;
                `}
              >
                <IconCard
                  icon="wallet"
                  leftContent={{
                    title: truncateSolanaAddress(address),
                    align: "center",
                  }}
                  isActive={currentAddress === address}
                />
              </AriaButton>
            </li>
          ))}
        </menu>
      </Section>
    </div>
  );
};

export default RecentlyUsedAddressesList;
