import { css } from "@emotion/react";
import { Asset } from "../types";

const AssetIcon = ({ icon }: { icon: Asset["icon"] }) => {
  return (
    <div
      className="coin-wrapper | aspect-ratio-square"
      css={css`
        border-radius: var(--border-radius-circle);
        width: var(--size-600);
        overflow: hidden;
      `}
    >
      {icon.type !== "text" ? (
        <img
          src={icon.content}
          css={css`
            object-fit: cover;
            width: 100%;
            height: 100%;
          `}
        />
      ) : (
        <div
          css={css`
            text-align: center;
            align-content: center;
            width: 100%;
            height: 100%;
            background-color: ${icon.backgroundColor};
            color: ${icon.color};
            font-size: var(--fs-xx-small);
            font-weight: var(--fw-active);
          `}
        >
          <p>{icon.content}</p>
        </div>
      )}
    </div>
  );
};

export default AssetIcon;
