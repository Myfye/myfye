import { css } from "@emotion/react";
import logo from "@/assets/logo/myfye_logo_white.svg";
import Ring180Loader from "./spinners/180RingLoader";

const LoadingScreen = () => {
  return (
    <div
      className="loading-screen"
      css={css`
        display: grid;
        place-items: center;
        height: 100lvh;
        background-color: var(--clr-primary);
      `}
    >
      <section
        css={css`
          display: grid;
          place-items: center;
        `}
      >
        <img
          src={logo}
          alt="MyFye"
          css={css`
            width: 8rem;
            height: auto;
          `}
        />
        <div
          className="loader-wrapper"
          css={css`
            margin-block-start: var(--size-200);
          `}
        >
          <Ring180Loader width={20} height={20} fill="var(--clr-white)" />
        </div>
      </section>
    </div>
  );
};

export default LoadingScreen;
