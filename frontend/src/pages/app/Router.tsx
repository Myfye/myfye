import { useState } from "react";
import {
  TabList as AriaTabList,
  Tabs as AriaTabs,
  TabPanel as AriaTabPanel,
  Tab as AriaTab,
} from "react-aria-components";
import Home from "./home/Home";
import {
  HouseSimple as HomeIcon,
  Wallet as WalletIcon,
  ArrowsLeftRight as PayIcon,
  ClockCounterClockwise as ActivityIcon,
  Scan as ScanIcon,
} from "@phosphor-icons/react";

import { css } from "@emotion/react";
import Footer from "../../shared/components/layout/nav/footer/Footer";
import NavMenu from "../../shared/components/layout/nav/header/nav-menu/NavMenu";
import Header from "../../shared/components/layout/nav/header/Header";
import Wallet from "@/pages/app/wallet/Wallet";
import { useDispatch } from "react-redux";
import { setQRCodeModalOpen } from "@/redux/modalReducers";
import Button from "../../shared/components/ui/button/Button";
import { motion, AnimatePresence } from "motion/react";
import Pay from "@/pages/app/pay/Pay";

const tabs = [
  { id: "home", label: "Home" },
  { id: "wallet", label: "Wallet" },
  { id: "pay", label: "Pay" },
  { id: "activity", label: "Activity" },
];

const MotionTabLabel = motion(AriaTabPanel);

const variants = {
  visible: { opacity: 1, transition: { duration: 0.4 } },
  hidden: { opacity: 0, transition: { duration: 0.6 } },
};

const Router = () => {
  const dispatch = useDispatch();
  let [selectedKey, setSelectedKey] = useState(tabs[0].id);

  const getTabIcon = (id: string, isSelected: boolean) => {
    const color = isSelected ? "var(--clr-primary)" : "var(--clr-neutral-700)";
    const weight = isSelected ? "fill" : "regular";
    switch (id) {
      case "home": {
        return (
          <HomeIcon
            color={color}
            weight={weight}
            size={24}
            css={css`
              margin-inline: auto;
            `}
          />
        );
      }
      case "wallet": {
        return (
          <WalletIcon
            color={color}
            weight={weight}
            size={24}
            css={css`
              margin-inline: auto;
            `}
          />
        );
      }
      case "pay": {
        return (
          <PayIcon
            color={color}
            weight={weight}
            size={24}
            css={css`
              margin-inline: auto;
            `}
          />
        );
      }
      case "activity": {
        return (
          <ActivityIcon
            color={color}
            weight={weight}
            size={24}
            css={css`
              margin-inline: auto;
            `}
          />
        );
      }
      default: {
        throw new Error(`Tab ID ${id} is invalid.`);
      }
    }
  };

  return (
    <div
      className="router"
      css={css`
        height: 100cqh;
      `}
    >
      <AriaTabs
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
        css={css`
          display: grid;
          grid-template-rows: auto 1fr auto;
          height: 100cqh;
        `}
      >
        <Header>
          <NavMenu></NavMenu>
          <Button
            iconOnly
            icon={ScanIcon}
            onPress={() => dispatch(setQRCodeModalOpen(true))}
            color="white"
          ></Button>
        </Header>
        <main>
          <AnimatePresence mode="wait">
            {tabs.map((tab) => (
              <MotionTabLabel
                id={tab.id}
                key={`tab-panel-${tab.id}`}
                css={css`
                  container: tab / size;
                  min-height: 100%;
                  height: 100%;
                `}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={variants}
                  key={tab.id}
                  css={css`
                    height: 100cqh;
                  `}
                >
                  {tab.id === "home" && <Home />}
                  {tab.id === "wallet" && <Wallet />}
                  {tab.id === "pay" && <Pay />}
                  {tab.id === "activity" && <div></div>}
                </motion.div>
              </MotionTabLabel>
            ))}
          </AnimatePresence>
        </main>
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
                css={css`
                  display: block;
                  align-content: center;
                  width: var(--size-800);
                  padding-block-start: var(--size-050);
                  padding-block-end: var(--size-025);
                  user-select: none;
                `}
                key={`tab-${tab.id}`}
              >
                {({ isSelected }) => (
                  <>
                    {getTabIcon(tab.id, isSelected)}
                    <p
                      css={css`
                        margin-block-start: calc(1 / 16 * 1rem);
                        font-weight: var(--fw-active);
                        font-size: var(--fs-x-small);
                        text-align: center;
                        color: ${isSelected
                          ? "var(--clr-primary)"
                          : "var(--clr-neutral-700)"};
                      `}
                    >
                      {tab.label}
                    </p>
                  </>
                )}
              </AriaTab>
            )}
          </AriaTabList>
        </Footer>
      </AriaTabs>
    </div>
  );
};

export default Router;
