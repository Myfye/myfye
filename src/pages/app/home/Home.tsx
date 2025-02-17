import Tabs from "./_components/Tabs";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Home = () => {
  return (
    <div
      className="home"
      css={css`
        container: home / size;
        height: 100%;
      `}
    >
      <Tabs></Tabs>
    </div>
  );
};

export default Home;
