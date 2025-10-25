import { css } from "@emotion/react";
import HomeTabs from "./HomeTabs";

const Home = () => {
  return (
    <div
      className="home"
      css={css`
        height: 100cqh;
      `}
    >
      <HomeTabs />
    </div>
  );
};

export default Home;
