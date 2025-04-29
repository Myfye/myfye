import { User } from "@/features/users/types";
import UserCard from "./UserCard";

import { css } from "@emotion/react";

const UserCardList = ({
  users,
  onUserSelect,
}: {
  users: User[];
  onUserSelect: (user: User) => void;
}) => {
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
          key={`user-${user.uid}`}
          className="user-card-wrapper"
          css={css`
            display: block;
            width: 100%;
          `}
        >
          <UserCard
            key={user.uid}
            name={user.first_name}
            email={user.email}
            phoneNumber={user.phone_number}
            onPress={() => onUserSelect(user)}
          />
        </li>
      ))}
    </ul>
  );
};

export default UserCardList;
