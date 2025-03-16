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
      <HomeTabs></HomeTabs>
    </div>
  );
};

export default Home;
