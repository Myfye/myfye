import { useState, useEffect } from "react";

import { css } from "@emotion/react";

import Overlay from "@/shared/components/ui/overlay/Overlay";
import UserCardList from "@/features/users/components/cards/UserCardList";
import UserCard from "@/features/users/components/cards/UserCard";
import SearchField from "@/features/users/components/SearchField";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import QRScanner from "../../qr-code/components/QRScanner";
import { useGetTopContactsQuery } from "../../contacts/api/contactsApi";
import { User } from "../types/users.types";
import Section from "@/shared/components/ui/section/Section";
import CardSkeleton from "@/shared/components/ui/card/CardSkeleton";
import { Link } from "react-aria-components";
import QrScanner from "qr-scanner";
import { useSearchUsersQuery } from "../api/usersApi";

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

  const [isValidEmail, setIsValidEmail] = useState(false);

  const userId = useSelector(
    (state: RootState) => state.userWalletData.currentUserID
  );

  const { data: searchData } = useSearchUsersQuery(
    { query, userId },
    { skip: !query }
  );

  const handleQRScannerOpen = (isOpen: boolean) => {
    setQRScannerOpen(isOpen);
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    setIsValidEmail(emailRegex.test(query));
  }, [query]);

  const showNewUserCard = isValidEmail && searchData?.length === 0;

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
            <label
              css={css`
                display: block;
                font-size: var(--fs-medium);
                font-weight: var(--fw-medium);
                color: var(--clr-text-strong);
                margin-block-end: var(--size-100);
              `}
            >
              Enter an email to send money to
            </label>
            <SearchField
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
            {showNewUserCard ? (
              <Section title="Send To">
                <UserCard
                  name={null}
                  email={query}
                  phone={null}
                  onPress={() => {
                    const newUser: User = {
                      email: query,
                    };
                    onUserSelect(newUser);
                  }}
                />
              </Section>
            ) : query ? (
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
      return <></>;
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
