import { css } from "@emotion/react";
import logo from "@/assets/Logo.png";
import Ring180Loader from "./spinners/180RingLoader";

const LoadingScreen = () => {
  return (
    <div
      className="loading-screen"
      css={css`
        display: grid;
        place-items: center;
        height: 100dvh;
        background-color: var(--clr-accent);
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
            margin-block-start: var(--size-100);
          `}
        >
          <Ring180Loader width={20} height={20} fill="var(--clr-white)" />
        </div>
      </section>
    </div>
  );
};

export default LoadingScreen;
