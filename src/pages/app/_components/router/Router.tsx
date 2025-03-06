import {
  animate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  TabList as AriaTabList,
  Tabs as AriaTabs,
  TabPanel as AriaTabPanel,
  Tab as AriaTab,
  Collection,
} from "react-aria-components";
import Home from "../../home/Home";
import {
  HouseSimple as HomeIcon,
  Wallet as WalletIcon,
  ArrowsLeftRight as PayIcon,
  ClockCounterClockwise as ActivityIcon,
  IconContext,
} from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Footer from "../layout/footer/Footer";
import NavMenu from "../layout/header/nav-menu/NavMenu";
import QRCodeDialog from "../qr-code/QRCodeDialog";
import Header from "../layout/header/Header";

const tabs = [
  { id: "home", label: "Home" },
  { id: "wallet", label: "Wallet" },
  { id: "pay", label: "Pay" },
  { id: "activity", label: "Activity" },
];

const Router = () => {
  let [selectedKey, setSelectedKey] = useState(tabs[0].id);

  let tabListRef = useRef(null!);
  let tabPanelsRef = useRef(null!);

  // Track the scroll position of the tab panel container.
  let { scrollXProgress } = useScroll({
    container: tabPanelsRef,
  });

  // Find all the tab elements so we can use their dimensions.
  let [tabElements, setTabElements] = useState([]);
  useEffect(() => {
    if (tabElements.length === 0) {
      let tabs = tabListRef.current.querySelectorAll("[role=tab]");
      setTabElements(tabs);
    }
  }, [tabElements]);

  // This function determines which tab should be selected
  // based on the scroll position.
  let getIndex = useCallback(
    (x) => Math.max(0, Math.floor((tabElements.length - 1) * x)),
    [tabElements]
  );

  // This function transforms the scroll position into the X position
  // or width of the selected tab indicator.
  const transform = (x, property) => {
    if (!tabElements.length) return 0;

    // Find the tab index for the scroll X position.
    let index = getIndex(x);

    // Get the difference between this tab and the next one.
    let difference =
      index < tabElements.length - 1
        ? tabElements[index + 1][property] - tabElements[index][property]
        : tabElements[index].offsetWidth;

    // Get the percentage between tabs.
    // This is the difference between the integer index and fractional one.
    let percent = (tabElements.length - 1) * x - index;

    // Linearly interpolate to calculate the position of the selection indicator.
    let value = tabElements[index][property] + difference * percent;

    // iOS scrolls weird when translateX is 0 for some reason. 🤷‍♂️
    return value || 0.1;
  };

  let x = useTransform(scrollXProgress, (x) => transform(x, "offsetLeft"));
  let width = useTransform(scrollXProgress, (x) => transform(x, "offsetWidth"));

  // When the user scrolls, update the selected key
  // so that the correct tab panel becomes interactive.
  useMotionValueEvent(scrollXProgress, "change", (x) => {
    if (animationRef.current || !tabElements.length) return;
    setSelectedKey(tabs[getIndex(x)].id);
  });

  // When the user clicks on a tab perform an animation of
  // the scroll position to the newly selected tab panel.
  let animationRef = useRef(null!);
  let onSelectionChange = (selectedKey) => {
    setSelectedKey(selectedKey);

    // If the scroll position is already moving but we aren't animating
    // then the key changed as a result of a user scrolling. Ignore.
    if (scrollXProgress.getVelocity() && !animationRef.current) {
      return;
    }

    let tabPanel = tabPanelsRef.current;
    let index = tabs.findIndex((tab) => tab.id === selectedKey);
    animationRef.current?.stop();
    animationRef.current = animate(
      tabPanel.scrollLeft,
      tabPanel.scrollWidth * (index / tabs.length),
      {
        type: "spring",
        bounce: 0,
        duration: 0.6,
        onUpdate: (v) => {
          tabPanel.scrollLeft = v;
        },
        onPlay: () => {
          // Disable scroll snap while the animation is going or weird things happen.
          tabPanel.style.scrollSnapType = "none";
        },
        onComplete: () => {
          tabPanel.style.scrollSnapType = "";
          animationRef.current = null;
        },
      }
    );
  };

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
        <QRCodeDialog />
      </Header>
      <AriaTabs
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
        css={css`
          display: grid;
          grid-template-rows: 1fr 4.5rem;
          height: 100%;
        `}
      >
        <div
          ref={tabPanelsRef}
          className="no-scrollbar"
          css={css`
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          `}
        >
          <Collection items={tabs}>
            {(tab) => (
              <AriaTabPanel
                shouldForceMount
                css={css`
                  width: 100%;
                  flex-shrink: 0;
                  scroll-snap-align: start;
                `}
              >
                {tab.id === "home" && <Home />}
                {tab.id === "wallet" && <div></div>}
                {tab.id === "pay" && <div></div>}
                {tab.id === "activity" && <div></div>}
              </AriaTabPanel>
            )}
          </Collection>
        </div>
        <Footer>
          <AriaTabList
            ref={tabListRef}
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
              >
                <IconContext.Provider
                  value={{
                    color:
                      tab.id === selectedKey
                        ? "var(--clr-accent)"
                        : "var(--clr-neutral-700)",

                    weight: tab.id === selectedKey ? "fill" : "regular",
                    size: "var(--size-400)",
                  }}
                >
                  {tab.id === "home" && (
                    <HomeIcon
                      css={css`
                        margin: 0 auto;
                      `}
                    />
                  )}
                  {tab.id === "wallet" && (
                    <WalletIcon
                      css={css`
                        margin: 0 auto;
                      `}
                    />
                  )}
                  {tab.id === "pay" && (
                    <PayIcon
                      css={css`
                        margin: 0 auto;
                      `}
                    />
                  )}
                  {tab.id === "activity" && (
                    <ActivityIcon
                      css={css`
                        margin: 0 auto;
                      `}
                    />
                  )}
                </IconContext.Provider>
                <p
                  css={css`
                    margin-top: var(--size-025);
                    font-weight: var(--fw-active);
                    font-size: var(--fs-small);
                    text-align: center;
                    color: ${tab.id === selectedKey
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
