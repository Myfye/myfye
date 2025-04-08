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
      <img
        src={icon}
        css={css`
          object-fit: cover;
          width: 100%;
          height: 100%;
        `}
      />
    </div>
  );
};

export default AssetIcon;
