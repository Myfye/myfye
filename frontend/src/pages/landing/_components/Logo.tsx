import logo from "@/assets/logo/myfye_logo_dark_green.svg";
import { css } from "@emotion/react";

const Logo = () => {
  return (
    <h1>
      <img
        src={logo}
        alt="MyFye"
        css={css`
          margin-block-end: var(--size-100);
          width: 7.5rem;
          height: auto;
        `}
      />
    </h1>
  );
};

export default Logo;
