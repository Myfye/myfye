import Contact from "./ContactCard";

/** @jsxImportSource @emotion/react */
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
        gap: var(--size-300);
      `}
    >
      {contacts.map((contact) => (
        <li
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
