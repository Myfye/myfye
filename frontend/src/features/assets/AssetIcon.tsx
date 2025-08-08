import { css } from "@emotion/react";
import { Asset } from "./types";

interface AssetIconProps {
  icon: Asset["icon"] | string;
  width?: string;
}

const AssetIcon = ({ icon, width = "2.75rem" }: AssetIconProps) => {
  return (
    <div
      className="icon-wrapper | aspect-ratio-square"
      css={css`
        border-radius: var(--border-radius-circle);
        width: ${width};
        overflow: hidden;
      `}
    >
      {typeof icon === "string" ? (
        <img
          src={icon}
          css={css`
            object-fit: cover;
            width: 100%;
            height: 100%;
          `}
        />
      ) : icon.type !== "text" ? (
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
