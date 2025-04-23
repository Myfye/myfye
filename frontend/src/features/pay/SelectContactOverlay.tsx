import { useEffect, useState } from "react";

import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import ContactCardList from "@/features/contacts/ContactCardList";
import WalletSearchField from "@/components/ui/search/WalletSearchField";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleOverlay, updateContact } from "./paySlice";
import { Contact } from "../contacts/types";

const contacts = [
  {
    id: crypto.randomUUID(),
    name: "Eli",
    walletAddress: "bc1qqslsrflelu64t65wse9hava40zfk9azej82nvc",
  },
  {
    id: crypto.randomUUID(),
    name: "Gavin",
    walletAddress: "bc1q80f59674hut29hmcr5pwdyayaaxm3hrsktxvnf",
  },
  {
    id: crypto.randomUUID(),
    name: "Chadwick",
    walletAddress: "1FfmbHfnpaZjKFvyi1okTjJJusN455paPH",
  },
];

const SelectContactOverlay = ({ zIndex = 2000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.pay.overlays.selectContact.isOpen
  );
  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleOverlay({ type: "selectContact", isOpen: isOpen }));
  };

  const contact = useSelector(
    (state: RootState) => state.pay.transaction.contact
  );

  const onContactSelect = (contact: Contact | null) => {
    dispatch(updateContact(contact));
  };

  const [searchValue, setSearchValue] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    if (searchValue === "") return true;
    const searchVal = searchValue.toLowerCase();
    const name = contact.name.toLowerCase();
    const walletAddress = contact.walletAddress.toLowerCase();

    const re = new RegExp(searchVal, "g");

    return name.match(re) || walletAddress.match(re);
  });

  useEffect(() => {
    console.log(filteredContacts);
  }, [filteredContacts]);
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
          <WalletSearchField
            value={searchValue}
            onChange={(e: string) => setSearchValue(e)}
          />
          <section
            css={css`
              margin-block-start: var(--size-500);
            `}
          >
            <h2
              className="heading-medium"
              css={css`
                margin-block-end: var(--size-250);
                color: var(--clr-text);
              `}
            >
              Contacts
            </h2>
            {filteredContacts.length === 0 ? (
              <ContactCardList
                contacts={[
                  { name: searchValue, walletAddress: "No previous sends" },
                ]}
                onContactSelect={onContactSelect}
              />
            ) : (
              <ContactCardList
                contacts={filteredContacts}
                onContactSelect={onContactSelect}
              />
            )}
          </section>
        </section>
      </Overlay>
    </>
  );
};

export default SelectContactOverlay;
