import { Suspense, useEffect, useState } from "react";

import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import UserCardList from "@/features/users/cards/UserCardList";
import UserSearchField from "@/features/users/UserSearchField";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay, updateUser } from "./paySlice";
import { Contact } from "../contacts/types";
import QRScanner from "../qr-code/QRScanner";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { useGetTopContactsQuery } from "../contacts/contactsApi";
import { useSearchUsersQuery } from "../users/usersApi";

const SelectUserOverlay = ({ zIndex = 2000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.pay.overlays.selectUser.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleOverlay({ type: "selectUser", isOpen: isOpen }));
  };

  const [isQRScannerOpen, setQRScannerOpen] = useState(false);

  const handleQRScannerOpen = (isOpen: boolean) => {
    setQRScannerOpen(isOpen);
  };

  const onUserSelect = (user) => {
    dispatch(updateUser(user));
    dispatch(toggleOverlay({ type: "confirmTransaction", isOpen: true }));
  };

  const [query, setQuery] = useState("");

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
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
                <TopContacts onUserSelect={onUserSelect} />
                <button onClick={() => onUserSelect(null)}>
                  Click me to continue
                </button>
              </>
            )}
          </section>
        </section>
      </Overlay>
      <QRScanner
        isOpen={isQRScannerOpen}
        onOpenChange={handleQRScannerOpen}
        zIndex={2001}
      />
    </>
  );
};

export default SelectUserOverlay;

const TopContacts = ({ onUserSelect }) => {
  const userId = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );
  const { data, isFetching, isLoading, isSuccess, isError, isUninitialized } =
    useGetTopContactsQuery(userId);
  
  console.log("TopContacts - userId:", userId);
  console.log("TopContacts - data:", data);
  
  if (isLoading || isUninitialized || isFetching) {
    return <div>Loading...</div>;
  }
  if (isSuccess) {
    return (
      <section>
        <h2>Top contacts</h2>
        <UserCardList users={data} onUserSelect={onUserSelect} />
      </section>
    );
  }
  return <div>Error loading contacts. Please try again.</div>;
};

const SearchedUsers = ({ query, onUserSelect }) => {
  const userId = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );
  const { data, isFetching, isLoading, isSuccess, isError, isUninitialized } =
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
