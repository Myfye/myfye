import Contact from "./ContactCard";

import { css } from "@emotion/react";

const ContactCardList = ({ contacts, onContactSelect }) => {
  return (
    <ul
      className="contact-card-list"
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--size-150);
      `}
    >
      {contacts.map((contact) => (
        <li
          key={`contact-${contact.id}`}
          className="contact-card-wrapper"
          css={css`
            display: block;
            width: 100%;
          `}
        >
          <Contact
            name={contact.name}
            walletAddress={contact.walletAddress}
            onPress={() => onContactSelect(contact)}
          />
        </li>
      ))}
    </ul>
  );
};

export default ContactCardList;
