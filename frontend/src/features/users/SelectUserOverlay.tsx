import { useState } from "react";

import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import UserCardList from "@/features/users/cards/UserCardList";
import UserSearchField from "@/features/users/UserSearchField";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import QRScanner from "../qr-code/QRScanner";
import { useGetTopContactsQuery } from "../contacts/contactsApi";
import { useSearchUsersQuery } from "../users/usersApi";
import { User } from "@privy-io/react-auth";

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
  onScanSuccess: (e: unknown) => void;
  onScanFail: (e: unknown) => void;
  zIndex: number;
}) => {
  const [isQRScannerOpen, setQRScannerOpen] = useState(false);

  const handleQRScannerOpen = (isOpen: boolean) => {
    setQRScannerOpen(isOpen);
  };

  const [query, setQuery] = useState("");

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Choose Recepient"
        zIndex={zIndex}
      >
        <section
          css={css`
            margin-block-start: var(--size-300);
            padding: 0 var(--size-250);
          `}
        >
          <UserSearchField
            value={query}
            onChange={(e: string) => setQuery(e)}
            onScanTogglerPress={() => setQRScannerOpen(true)}
          />
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
        </section>
      </Overlay>
      <QRScanner
        isOpen={isQRScannerOpen}
        onOpenChange={handleQRScannerOpen}
        onScanSuccess={onScanSuccess}
        onScanFail={onScanFail}
        zIndex={2001}
      />
    </>
  );
};

export default SelectUserOverlay;

const TopContacts = ({
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
    useGetTopContactsQuery(userId);

  console.log("TopContacts - userId:", userId);
  console.log("TopContacts - data:", data);

  if (isLoading || isUninitialized || isFetching) {
    return <div>Loading...</div>;
  }
  if (isSuccess) {
    if (data.length === 0) {
      return <div>Search users</div>;
    }
    return (
      <section>
        <h2>Top contacts</h2>
        <UserCardList users={data} onUserSelect={onUserSelect} />
      </section>
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
    return <div>Loading...</div>;
  }
  if (isSuccess) {
    return (
      <section>
        <h2>Search people</h2>
        <UserCardList users={data} onUserSelect={onUserSelect} />
      </section>
    );
  }
  return <div>Error loading search results. Please try again.</div>;
};
