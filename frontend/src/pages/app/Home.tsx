import PrivyUseSolanaWallets from "../../components/PrivyUseSolanaWallets";
import HomeTabs from "@/features/home/HomeTabs";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Home = () => {
  return (
    <div
      className="home"
      css={css`
        height: 100cqh;
      `}
    >
      <PrivyUseSolanaWallets />
      <HomeTabs></HomeTabs>
    </div>
  );
};

export default Home;
