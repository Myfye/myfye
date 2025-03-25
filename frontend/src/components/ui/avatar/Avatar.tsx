/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Wallet } from "@phosphor-icons/react";

const Avatar = ({ src = "", size = "var(--size-600)" }) => {
  return (
    <div
      className="avatar-wrapper | aspect-ratio-square"
      css={css`
        border-radius: var(--border-radius-circle);
        width: ${size};
        overflow: hidden;
      `}
    >
      {src ? (
        <img
          src={src}
          css={css`
            object-fit: cover;
            width: 100%;
            height: 100%;
          `}
        />
      ) : (
        <div
          css={css`
            display: grid;
            place-items: center;
            height: 100%;
            background-color: var(--clr-surface-lowered);
          `}
        >
          <Wallet color="var(--clr-icon)" size={24} />
        </div>
      )}
    </div>
  );
};

export default Avatar;
