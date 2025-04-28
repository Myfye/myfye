import User from "./UserCard";

import { css } from "@emotion/react";

const UserCardList = ({ users, onUserSelect }) => {
  return (
    <ul
      className="user-card-list"
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--size-150);
      `}
    >
      {users.map((user) => (
        <li
          key={`user-${user.id}`}
          className="user-card-wrapper"
          css={css`
            display: block;
            width: 100%;
          `}
        >
          <User
            name={user.name}
            email={user.email}
            onPress={() => onUserSelect(user)}
          />
        </li>
      ))}
    </ul>
  );
};

export default UserCardList;
