import { css } from "@emotion/react";
import HomeTabs from "./components/HomeTabs";
import { Item } from "react-stately";
import DashboardPanel from "./components/panels/dashboard/DashboardPanel";
import CashPanel from "./components/panels/cash/CashPanel";
import CryptoPanel from "./components/panels/crypto/CryptoPanel";
import StocksPanel from "./components/panels/stocks/StocksPanel";
import { useState } from "react";

const Home = () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  return (
    <div
      className="home"
      css={css`
        height: 100cqh;
      `}
    >
      <HomeTabs
        selectedKey={selectedKey}
        onSelectionChange={(e) => setSelectedKey(e)}
      >
        <Item key="dashboard" title="Dashboard">
          <DashboardPanel />
        </Item>
        <Item key="cash" title="Cash">
          <CashPanel />
        </Item>
        <Item key="crypto" title="Crypto">
          <CryptoPanel />
        </Item>
        <Item key="stocks" title="Stocks">
          <StocksPanel />
        </Item>
      </HomeTabs>
    </div>
  );
};

export default Home;
