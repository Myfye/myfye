import {
  HouseSimple as HomeIcon,
  Wallet as WalletIcon,
  ArrowsLeftRight as PayIcon,
  ClockCounterClockwise as ActivityIcon,
} from "@phosphor-icons/react";

import Tab from "./Tab";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const AppNavDrawer = () => {
  return (
    <nav>
      <ul
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <Tab icon={HomeIcon} title="Home" active={true} />
        <Tab icon={WalletIcon} title="Wallet" active={false} />
        <Tab icon={PayIcon} title="Pay" active={false} />
        <Tab icon={ActivityIcon} title="Activity" active={false} />
      </ul>
    </nav>
  );
};

export default AppNavDrawer;
