import {
  Collection,
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
} from "react-aria-components";
import {
  animate,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { css } from "@emotion/react";
import DashboardPanel from "./panels/dashboard/DashboardPanel";
import CashPanel from "./panels/cash/CashPanel";
import CryptoPanel from "./panels/crypto/CryptoPanel";
import StocksPanel from "./panels/stocks/StocksPanel";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "cash", label: "Cash" },
  { id: "crypto", label: "Crypto" },
  { id: "stocks", label: "Stocks" },
];

const HomeTabs = () => {
  const [selectedKey, setSelectedKey] = useState(tabs[0].id);

  const tabListRef = useRef<HTMLDivElement>(null!);
  const tabPanelsRef = useRef<HTMLDivElement>(null!);

  // Track the scroll position of the tab panel container.
  const { scrollXProgress } = useScroll({
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

  // When the user clicks on a tab perform an animation of
  // the scroll position to the newly selected tab panel.
  let animationRef = useRef(null!);
  let onSelectionChange = (selectedKey) => {
    setSelectedKey(selectedKey);

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
        onComplete: () => {
          animationRef.current = null;
        },
      }
    );
  };

  return (
    <AriaTabs
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      css={css`
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
        container: home-tabs / size;
      `}
    >
      <div
        className="tab-list-wrapper"
        css={css`
          position: relative;
          padding: 0 var(--size-250);
          height: 100%;
        `}
      >
        <TabList
          ref={tabListRef}
          css={css`
            display: flex;
            gap: var(--size-200);
          `}
          items={tabs}
        >
          {(tab) => (
            <Tab
              css={css`
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: flex-end;
                font-size: var(--fs-medium);
                font-weight: var(--fw-active);
                height: 2.25rem;
                padding-block-end: 0.625rem;
                cursor: pointer;
                color: var(--clr-text-neutral-strong);
                &:hover {
                  color: var(--clr-primary);
                }
                &[data-selected="true"] {
                  color: var(--clr-primary);
                }
              `}
            >
              <span>{tab.label}</span>
            </Tab>
          )}
        </TabList>
        {/* Selection indicator. */}
        <motion.span
          css={css`
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 1;
            background-color: var(--clr-primary);
            height: 3px;
          `}
          style={{ x, width }}
        />
      </div>
      <div
        ref={tabPanelsRef}
        className="no-scrollbar"
        css={css`
          display: flex;
          overflow-x: hidden;
          overflow-y: visible;
          background-color: var(--clr-surface);
        `}
      >
        <Collection items={tabs}>
          {(tab) => (
            <TabPanel
              shouldForceMount
              css={css`
                width: 100%;
                flex-shrink: 0;
                scroll-snap-align: start;
                container: ${tab.id}-panel / size;
              `}
            >
              {tab.id === "dashboard" && <DashboardPanel />}
              {tab.id === "cash" && <CashPanel />}
              {tab.id === "crypto" && <CryptoPanel />}
              {tab.id === "stocks" && <StocksPanel />}
            </TabPanel>
          )}
        </Collection>
      </div>
    </AriaTabs>
  );
};

export default HomeTabs;
