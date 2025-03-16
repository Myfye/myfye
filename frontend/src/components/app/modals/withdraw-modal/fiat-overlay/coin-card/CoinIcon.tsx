/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const CoinIcon = ({ src }) => {
  return (
    <img
      src={src}
      className="aspect-ratio-square"
      css={css`
        border-radius: var(--border-radius-circle);
        width: var(--size-600);
        overflow: hidden;
        object-fit: cover;
      `}
    />
  );
};

export default CoinIcon;
