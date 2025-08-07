import { css } from "@emotion/react";
import RingWithBgLoader from "../loading/spinners/RingWithBgLoader";

const OverlayLoader = () => {
  return (
    <div
      className="overlay-loader"
      css={css`
        display: grid;
        place-items: center;
        height: 100cqh;
      `}
    >
      <RingWithBgLoader />
    </div>
  );
};

export default OverlayLoader;
