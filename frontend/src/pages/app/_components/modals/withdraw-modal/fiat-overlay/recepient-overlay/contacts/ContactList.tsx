import Contact from "./Contact";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const ContactList = ({ contacts }) => {
  return (
    <div
      className="contact-list-wrapper"
      css={css`
        margin-block-start: var(--size-500);
      `}
    >
      <ul
        className="contact-list"
        css={css`
          display: flex;
          flex-direction: column;
          gap: var(--size-250);
        `}
      >
        {contacts.map((contact) => (
          <li className="contact-wrapper">
            <Contact
              name={contact.name}
              walletAddress={contact.walletAddress}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
