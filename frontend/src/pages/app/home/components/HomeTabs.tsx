import {
  Collection,
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  Key,
} from "react-aria-components";
import {
  animate,
  AnimationPlaybackControlsWithThen,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTime,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { css } from "@emotion/react";
import DashboardPanel from "./panels/dashboard/DashboardPanel";
import CashPanel from "./panels/cash/CashPanel";
import CryptoPanel from "./panels/crypto/CryptoPanel";
import StocksPanel from "./panels/stocks/StocksPanel";
import {
  PULL_THRESHOLD,
  usePullToRefresh,
} from "@/features/pull-to-refresh/usePullToRefresh";
import PullToRefreshIndicator from "@/features/pull-to-refresh/PullToRefreshIndicator";
import { useSolanaWallets } from "@privy-io/react-auth";
import { useDispatch } from "react-redux";
import getSolanaBalances from "@/functions/GetSolanaBalances";
import { usePullToRefreshRotate } from "@/features/pull-to-refresh/usePullToRefreshRotate";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "cash", label: "Cash" },
  { id: "crypto", label: "Crypto" },
  { id: "stocks", label: "Stocks" },
];

const HomeTabs = () => {
  const [selectedKey, setSelectedKey] = useState<Key>(tabs[0].id);

  const tabListRef = useRef<HTMLDivElement>(null!);
  const tabPanelsRef = useRef<HTMLDivElement>(null!);
  const { wallets } = useSolanaWallets();
  const dispatch = useDispatch();
  const solanaAddress = wallets[0].address;

  const { pullChange, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await getSolanaBalances(solanaAddress, dispatch);
    },
    ref: tabPanelsRef,
  });

  const marginTop = useTransform(pullChange, (x) => x / 3.118);
  const opacity = useTransform(pullChange, [0, PULL_THRESHOLD], [0, 1]);
  const rotate = usePullToRefreshRotate({ pullChange, isRefreshing });

  useEffect(() => {
    const el = tabPanelsRef.current;
    if (!el) return;
    const getIndex = () =>
      Math.max(0, Math.floor(el.scrollLeft / el.offsetWidth));

    const handleScroll = () => {
      const x = el.scrollLeft;
      const y = el.scrollTop;

      const width = el.getBoundingClientRect().width;

      const index = getIndex();

      const xByIndex = Math.abs(x) - width * index;

      // Detect scroll direction
      const activeAxis =
        xByIndex === Math.abs(y) ? null : xByIndex > Math.abs(y) ? "x" : "y";

      // Lock opposite axis
      if (activeAxis === "x") {
        el.style.overflowX = "auto";
        el.style.overflowY = "hidden";
      } else if (activeAxis === "y") {
        el.style.overflowX = "hidden";
        el.style.overflowY = "auto";
      } else {
        el.style.overflowX = "auto";
        el.style.overflowY = "auto";
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => void el.removeEventListener("scroll", handleScroll);
  }, []);

  // Track the scroll position of the tab panel container.
  const { scrollXProgress } = useScroll({
    container: tabPanelsRef,
  });

  // Find all the tab elements so we can use their dimensions.
  const [tabElements, setTabElements] = useState<HTMLDivElement[]>([]);
  useEffect(() => {
    if (tabElements.length === 0) {
      const tabs = [
        ...tabListRef.current.querySelectorAll<HTMLDivElement>("[role=tab]"),
      ];
      setTabElements(tabs);
    }
  }, [tabElements]);

  // This function determines which tab should be selected
  // based on the scroll position.
  const getIndex = (x: number) =>
    Math.max(0, Math.floor((tabElements.length - 1) * x));

  // This function transforms the scroll position into the X position
  // or width of the selected tab indicator.
  const transform = (x: number, property: "offsetLeft" | "offsetWidth") => {
    if (!tabElements.length) return 0;

    // Find the tab index for the scroll X position.
    const index = getIndex(x);

    // Get the difference between this tab and the next one.
    const difference =
      index < tabElements.length - 1
        ? tabElements[index + 1][property] - tabElements[index][property]
        : tabElements[index].offsetWidth;

    // Get the percentage between tabs.
    // This is the difference between the integer index and fractional one.
    const percent = (tabElements.length - 1) * x - index;

    // Linearly interpolate to calculate the position of the selection indicator.
    const value = tabElements[index][property] + difference * percent;

    // iOS scrolls weird when translateX is 0 for some reason. 🤷‍♂️
    return value || 0.1;
  };

  const x = useTransform(scrollXProgress, (x) => transform(x, "offsetLeft"));
  const width = useTransform(scrollXProgress, (x) =>
    transform(x, "offsetWidth")
  );

  // When the user scrolls, update the selected key
  // so that the correct tab panel becomes interactive.
  useMotionValueEvent(scrollXProgress, "change", (x) => {
    if (animationRef.current || !tabElements.length) return;
    setSelectedKey(tabs[getIndex(x)].id);
  });

  // When the user clicks on a tab perform an animation of
  // the scroll position to the newly selected tab panel.
  const animationRef = useRef<AnimationPlaybackControlsWithThen | null>(null);
  const onSelectionChange = (selectedKey: Key) => {
    setSelectedKey(selectedKey);

    // If the scroll position is already moving but we aren't animating
    // then the key changed as a result of a user scrolling. Ignore.
    if (scrollXProgress.getVelocity() && !animationRef.current) {
      return;
    }

    const tabPanel = tabPanelsRef.current;
    const index = tabs.findIndex((tab) => tab.id === selectedKey);
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
    <>
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
                  align-items: center;
                  justify-content: flex-start;
                  font-size: var(--fs-medium);
                  font-weight: var(--fw-active);
                  height: 3rem;
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
                <span
                  css={css`
                    display: inline-block;
                    padding-block-start: 0.5rem;
                  `}
                >
                  {tab.label}
                </span>
              </Tab>
            )}
          </TabList>
          {/* Selection indicator. */}
          <motion.div
            css={css`
              position: absolute;
              left: 0;
              bottom: 0.7rem;
              z-index: 1;
              height: 3px;
            `}
            style={{ x, width }}
          >
            <motion.div
              css={css`
                width: 80%;
                height: 100%;
                background-color: var(--clr-primary);
                margin-inline: auto;
              `}
            ></motion.div>
          </motion.div>
        </div>
        <div
          css={css`
            display: grid;
            position: relative;
            padding-block-start: var(--size-100);
          `}
        >
          <PullToRefreshIndicator style={{ opacity }} rotate={rotate} />
          <motion.div
            ref={tabPanelsRef}
            className="no-scrollbar"
            css={css`
              display: flex;
              overflow: auto;
              scroll-snap-type: x mandatory;
              background-color: var(--clr-surface);
              grid-column: 1 / -1;
              grid-row: 1 / -1;
              z-index: 1;
              position: relative;
            `}
            style={{ marginTop }}
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
          </motion.div>
        </div>
      </AriaTabs>
    </>
  );
};

export default HomeTabs;
