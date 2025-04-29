import { css } from "@emotion/react";
import Avatar from "../../../components/ui/avatar/Avatar";
import UserCardController from "./UserCardController";
import { useRef } from "react";

const UserCard = ({
  name,
  email,
  phone,
  ...restProps
}: {
  name: string | null;
  email: string | null;
  phone: string | null;
}) => {
  const ref = useRef(null!);
  return (
    <UserCardController {...restProps} ref={ref}>
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
            gap: var(--size-150);
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
                {name || email || phone}
              </p>
              {name && (
                <p
                  css={css`
                    font-size: var(--fs-small);
                    color: var(--clr-text-weaker);
                    margin-block-start: var(--size-050);
                    max-width: 80cqw;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  `}
                >
                  {email || phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserCardController>
  );
};

export default UserCard;
