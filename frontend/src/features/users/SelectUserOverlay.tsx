import { useState } from "react";

import { css } from "@emotion/react";

import Overlay from "@/shared/components/ui/overlay/Overlay";
import UserCardList from "@/features/users/cards/UserCardList";
import UserSearchField from "@/features/users/UserSearchField";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import QRScanner from "../qr-code/QRScanner";
import { useGetTopContactsQuery } from "../contacts/contactsApi";
import { useSearchUsersQuery } from "../users/usersApi";
import { User } from "./users.types";
import Section from "@/shared/components/ui/section/Section";
import CardSkeleton from "@/shared/components/ui/card/CardSkeleton";
import { Link } from "react-aria-components";
import QrScanner from "qr-scanner";

const SelectUserOverlay = ({
  isOpen,
  onOpenChange,
  onUserSelect,
  onScanSuccess,
  onScanFail,
  zIndex = 2000,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUserSelect: (user: User) => void;
  onScanSuccess?: (data: QrScanner.ScanResult) => void;
  onScanFail?: (error: Error | string) => void;
  zIndex?: number;
}) => {
  const [query, setQuery] = useState("");

  const [isQRScannerOpen, setQRScannerOpen] = useState(false);

  const handleQRScannerOpen = (isOpen: boolean) => {
    setQRScannerOpen(isOpen);
  };

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Choose Recepient"
        zIndex={zIndex}
      >
        <div
          css={css`
            padding: 0 var(--size-250);
            height: 100%;
          `}
        >
          <section
            css={css`
              padding-block-start: var(--size-300);
            `}
          >
            <UserSearchField
              value={query}
              onChange={(e: string) => setQuery(e)}
              onScanTogglerPress={() => setQRScannerOpen(true)}
            />
          </section>
          <section
            css={css`
              margin-block-start: var(--size-500);
            `}
          >
            {query ? (
              <SearchedUsers query={query} onUserSelect={onUserSelect} />
            ) : (
              <>
                <TopContacts query={query} onUserSelect={onUserSelect} />
              </>
            )}
          </section>
        </div>
      </Overlay>
      <QRScanner
        isOpen={isQRScannerOpen}
        onOpenChange={handleQRScannerOpen}
        onScanSuccess={(data) => {
          onScanSuccess && onScanSuccess(data);
        }}
        onScanFail={(e) => {
          setQRScannerOpen(false);
          onScanFail && onScanFail(e);
        }}
        zIndex={2001}
      />
    </>
  );
};

export default SelectUserOverlay;

const TopContacts = ({
  onUserSelect,
}: {
  query: string;
  onUserSelect: (user: User) => void;
}) => {
  const userId = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );
  const { data, isFetching, isLoading, isSuccess, isUninitialized } =
    useGetTopContactsQuery(userId);

  console.log("TopContacts - userId:", userId);
  console.log("TopContacts - data:", data);

  const isPending = isLoading || isUninitialized || isFetching;

  if (isPending) {
    return (
      <>
        <Section title="Top Contacts">
          <div
            css={css`
              display: grid;
              gap: var(--size-100);
            `}
          >
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </Section>
      </>
    );
  }

  if (isSuccess) {
    if (data.length === 0) {
      return (
        <>
          <section>Search users</section>
        </>
      );
    }
    return (
      <Section title="Top Contacts">
        <UserCardList users={data} onUserSelect={onUserSelect} />
      </Section>
    );
  }
};

const SearchedUsers = ({
  query,
  onUserSelect,
}: {
  query: string;
  onUserSelect: (user: User) => void;
}) => {
  const userId = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );
  const { data, isFetching, isLoading, isSuccess, isUninitialized } =
    useSearchUsersQuery({ query, userId });

  console.log("SearchedUsers - userId:", userId);
  console.log("SearchedUsers - data:", data);

  if (isLoading || isUninitialized || isFetching) {
    return (
      <Section title="Search People">
        <div
          css={css`
            display: grid;
            gap: var(--size-100);
          `}
        >
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </Section>
    );
  }
  if (isSuccess) {
    return (
      <Section title="Search People">
        {data.length === 0 ? (
          <div>
            <Link
              css={css`
                font-size: var(--fs-medium);
                color: var(--clr-primary);
                font-weight: var(--fw-heading);
              `}
            >
              Invite contact to Myfye
            </Link>
          </div>
        ) : (
          <UserCardList users={data} onUserSelect={onUserSelect} />
        )}
      </Section>
    );
  }
  return <div>Error loading search results. Please try again.</div>;
};
