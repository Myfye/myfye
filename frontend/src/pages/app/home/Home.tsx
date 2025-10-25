import { css } from "@emotion/react";
import HomeTabs from "./_components/HomeTabs";
import { Item } from "react-stately";
import DashboardPanel from "./_components/panels/dashboard/DashboardPanel";
import CashPanel from "./_components/panels/cash/CashPanel";
import CryptoPanel from "./_components/panels/crypto/CryptoPanel";
import StocksPanel from "./_components/panels/stocks/StocksPanel";
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
