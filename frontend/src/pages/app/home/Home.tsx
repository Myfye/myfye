import Header from "../_components/layout/header/Header";
import NavMenu from "../_components/layout/header/nav-menu/NavMenu";
import QRCodeDialog from "../_components/qr-code/QRCodeDialog";
import PrivyUseSolanaWallets from "../../../components/PrivyUseSolanaWallets";
import HomeTabs from "./_components/HomeTabs";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Home = () => {
  return (
    <div
      className="home"
      css={css`
        height: 100cqh;
        overflow-y: auto;
      `}
    >
      <PrivyUseSolanaWallets />
      <HomeTabs></HomeTabs>
    </div>
  );
};

export default Home;
