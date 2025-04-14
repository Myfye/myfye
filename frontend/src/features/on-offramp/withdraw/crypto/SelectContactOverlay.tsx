import { useMemo, useState } from "react";

import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import { Input, Label, Button as AriaButton } from "react-aria-components";
import SearchField from "@/components/ui/search/SearchField";
import ContactCardList from "@/components/ui/contact-card/ContactCardList";
import WalletSearchField from "@/components/ui/search/WalletSearchField";

const SelectContactOverlay = ({ isOpen, onOpenChange }) => {
  const [currentContact, setCurrentContact] = useState(null);

  const onContactSelect = (contact) => {
    setCurrentContact(contact);
  };
  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Choose Recepient"
      >
        <section
          css={css`
            margin-block-start: var(--size-400);
            padding: 0 var(--size-250);
          `}
        >
          <WalletSearchField />
          <section
            css={css`
              margin-block-start: var(--size-500);
            `}
          >
            <ContactCardList
              contacts={[
                { name: "Eli", walletAddress: "Testing123" },
                { name: "Gavin", walletAddress: "Testing123" },
                { name: "Chadwick", walletAddress: "Testing123" },
              ]}
              onContactSelect={onContactSelect}
            />
          </section>
        </section>
      </Overlay>
    </>
  );
};

export default SelectContactOverlay;
