import Contact from "./ContactCard";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const ContactCardList = ({ contacts }) => {
  return (
    <ul
      className="contact-card-list"
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--size-300);
        padding: 0 var(--size-250);
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
          <Contact name={contact.name} walletAddress={contact.walletAddress} />
        </li>
      ))}
    </ul>
  );
};

export default ContactCardList;
