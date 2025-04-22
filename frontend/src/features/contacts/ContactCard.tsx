import { css } from "@emotion/react";
import Avatar from "../../components/ui/avatar/Avatar";
import ContactCardController from "./ContactCardController";

const ContactCard = ({ name = "", walletAddress = "", ref, ...restProps }) => {
  return (
    <ContactCardController {...restProps} ref={ref}>
      <div
        className="contact-card"
        css={css`
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: var(--size-150);
          line-height: var(--line-height-tight);
          width: 100%;
          background-color: var(--clr-surface-raised);
          padding: var(--size-150);
          border-radius: var(--border-radius-medium);
          container: contact-card / size;
          height: 4.25rem;
        `}
      >
        <Avatar />
        <div
          className="content"
          css={css`
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: var(--size-200);
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              align-self: center;
            `}
          >
            <div
              className="title"
              css={css`
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
                flex-direction: column;
              `}
            >
              <p
                css={css`
                  font-size: var(--fs-medium);
                  font-weight: var(--fw-active);
                `}
              >
                {name}
              </p>
              <p
                css={css`
                  font-size: var(--fs-small);
                  color: var(--clr-text-weaker);
                  text-transform: uppercase;
                  margin-block-start: var(--size-050);
                  max-width: 80cqw;
                  text-overflow: ellipsis;
                  overflow: hidden;
                `}
              >
                {walletAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ContactCardController>
  );
};

export default ContactCard;
