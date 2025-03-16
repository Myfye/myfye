import { useEffect, useState, useState } from "react";
import {
  TabList as AriaTabList,
  Tabs as AriaTabs,
  TabPanel as AriaTabPanel,
  Tab as AriaTab,
} from "react-aria-components";
import Home from "../../pages/app/home/Home";
import {
  HouseSimple as HomeIcon,
  Wallet as WalletIcon,
  ArrowsLeftRight as PayIcon,
  ClockCounterClockwise as ActivityIcon,
  IconContext,
  Scan as ScanIcon,
} from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Footer from "./layout/footer/Footer";
import NavMenu from "./layout/header/nav-menu/NavMenu";
import QRCodeDialog from "./qr-code/QRCodeModal";
import Header from "./layout/header/Header";
import Wallet from "@/pages/app/wallet/Wallet";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch } from "react-redux";
import { setQRCodeModalOpen } from "@/redux/modalReducers";
import Button from "../ui/button/Button";

const tabs = [
  { id: "home", label: "Home" },
  { id: "wallet", label: "Wallet" },
  { id: "pay", label: "Pay" },
  { id: "activity", label: "Activity" },
];

const Router = () => {
  const dispatch = useDispatch();
  let [selectedKey, setSelectedKey] = useState(tabs[0].id);

  return (
    <div
      className="router"
      css={css`
        height: 100cqh;
        display: grid;
        grid-template-rows: var(--size-800) 1fr;
      `}
    >
      <Header>
        <NavMenu></NavMenu>
        <Button
          iconOnly
          icon={ScanIcon}
          onPress={() => dispatch(setQRCodeModalOpen(true))}
          color="transparent"
          data-size="large"
        ></Button>
      </Header>
      <AriaTabs
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
        css={css`
          display: grid;
          grid-template-rows: 1fr 4.5rem;
          height: 100%;
        `}
      >
        {tabs.map((tab) => (
          <AriaTabPanel id={tab.id} key={`tab-panel-${tab.id}`}>
            {tab.id === "home" && <Home />}
            {tab.id === "wallet" && <Wallet />}
            {tab.id === "pay" && <div></div>}
            {tab.id === "activity" && <div></div>}
          </AriaTabPanel>
        ))}

        <Footer>
          <AriaTabList
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
            items={tabs}
          >
            {(tab) => (
              <AriaTab
                className="aspect-ratio-square"
                css={css`
                  display: block;
                  align-content: center;
                  width: var(--size-700);
                `}
                key={`tab-${tab.id}`}
              >
                {tab.id === "home" && (
                  <HomeIcon
                    color={
                      selectedKey === tab.id
                        ? "var(--clr-accent)"
                        : "var(--clr-neutral-700)"
                    }
                    weight={selectedKey === tab.id ? "fill" : "regular"}
                    size={"var(--size-400)"}
                    css={css`
                      margin: 0 auto;
                    `}
                  />
                )}
                {tab.id === "wallet" && (
                  <WalletIcon
                    color={
                      selectedKey === tab.id
                        ? "var(--clr-accent)"
                        : "var(--clr-neutral-700)"
                    }
                    weight={selectedKey === tab.id ? "fill" : "regular"}
                    size={"var(--size-400)"}
                    css={css`
                      margin: 0 auto;
                    `}
                  />
                )}
                {tab.id === "pay" && (
                  <PayIcon
                    color={
                      selectedKey === tab.id
                        ? "var(--clr-accent)"
                        : "var(--clr-neutral-700)"
                    }
                    weight={selectedKey === tab.id ? "fill" : "regular"}
                    size={"var(--size-400)"}
                    css={css`
                      margin: 0 auto;
                    `}
                  />
                )}
                {tab.id === "activity" && (
                  <ActivityIcon
                    color={
                      selectedKey === tab.id
                        ? "var(--clr-accent)"
                        : "var(--clr-neutral-700)"
                    }
                    weight={selectedKey === tab.id ? "fill" : "regular"}
                    size={"var(--size-400)"}
                    css={css`
                      margin: 0 auto;
                    `}
                  />
                )}
                <p
                  css={css`
                    margin-top: var(--size-025);
                    font-weight: var(--fw-active);
                    font-size: var(--fs-small);
                    text-align: center;
                    color: ${selectedKey === tab.id
                      ? "var(--clr-accent)"
                      : "var(--clr-neutral-700)"};
                  `}
                >
                  {tab.label}
                </p>
              </AriaTab>
            )}
          </AriaTabList>
        </Footer>
      </AriaTabs>
    </div>
  );
};

export default Router;
