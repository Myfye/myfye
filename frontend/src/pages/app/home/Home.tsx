import HomeTabs from "@/pages/app/home/components/HomeTabs";
import { css } from "@emotion/react";

const Home = () => {
  return (
    <div
      className="home"
      css={css`
        height: 100cqh;
      `}
    >
      <HomeTabs></HomeTabs>
    </div>
  );
};

export default Home;
