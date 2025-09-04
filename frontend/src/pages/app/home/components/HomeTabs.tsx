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
  AnimatePresence,
  AnimationPlaybackControlsWithThen,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { css } from "@emotion/react";
import DashboardPanel from "./panels/dashboard/DashboardPanel";
import CashPanel from "./panels/cash/CashPanel";
import CryptoPanel from "./panels/crypto/CryptoPanel";
import StocksPanel from "./panels/stocks/StocksPanel";
import { usePullToRefresh } from "@/features/pull-to-refresh/usePullToRefresh";
import PullToRefreshIndicator from "@/features/pull-to-refresh/PullToRefreshIndicator";
import { useSolanaWallets } from "@privy-io/react-auth";
import { useDispatch } from "react-redux";
import getSolanaBalances from "@/functions/GetSolanaBalances";
import { AriaTabListProps, useTabList } from "react-aria";
import { useTabListState } from "react-stately";
import { cn } from "cn-utility";
import HomeTab from "./HomeTab";
import HomeTabPanel from "./HomeTabPanel";

const HomeTabs = ({ ...restProps }: AriaTabListProps<object>) => {
  const state = useTabListState(restProps);
  const ref = useRef<HTMLDivElement>(null!);
  const tabPanelsRef = useRef<HTMLDivElement>(null!);
  const { tabListProps } = useTabList(restProps, state, ref);
  const [direction, setDirection] = useState<1 | -1>(1);
  const {
    wallets: [wallet],
  } = useSolanaWallets();
  const dispatch = useDispatch();

  const solanaAddress = wallet?.address;

  const { spinnerParams, pullMargin } = usePullToRefresh({
    onRefresh: async () => {
      solanaAddress && (await getSolanaBalances(solanaAddress, dispatch));
    },
    container: tabPanelsRef,
  });

  const width = useMotionValue(0);
  const x = useMotionValue(0);

  const [prevSelectedKey, setPrevSelectedKey] = useState(state.selectedKey);

  if (state.selectedKey !== prevSelectedKey) {
    setPrevSelectedKey(state.selectedKey);
    // check if prev key has bigger or lesser index
    const collection = [...state.collection];
    const prevKeyIndex = collection.findIndex(
      (item) => item.key === prevSelectedKey
    );
    const index = state.selectedItem?.index;
    if (index !== undefined && prevKeyIndex !== undefined) {
      if (prevKeyIndex > index) {
        setDirection(-1);
      } else if (prevKeyIndex < index) {
        setDirection(1);
      }
    }
  }

  useEffect(() => {
    const activeTab = ref.current.querySelector<HTMLDivElement>(
      '[role="tab"][aria-selected="true"]'
    );

    const _animate = () => {
      if (activeTab?.offsetWidth && activeTab?.offsetLeft) {
        animate(width, activeTab?.offsetWidth, {
          type: "spring",
          bounce: 0,
          duration: 0.6,
        });
        animate(x, activeTab?.offsetLeft, {
          type: "spring",
          bounce: 0,
          duration: 0.6,
        });
      }
    };

    _animate();
  });

  return (
    <>
      <div
        className={cn("home-tabs", restProps.orientation)}
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
          <div
            {...tabListProps}
            ref={ref}
            css={css`
              display: flex;
              gap: var(--size-200);
            `}
          >
            {[...state.collection].map((item) => (
              <HomeTab key={item.key} item={item} state={state} />
            ))}
          </div>
          {/* Selection indicator. */}
          <motion.div
            aria-hidden="true"
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
          <PullToRefreshIndicator style={spinnerParams} />
          <motion.div
            ref={tabPanelsRef}
            css={css`
              overflow-y: auto;
              overflow-x: hidden;
              background-color: var(--clr-surface);
              z-index: 1;
              position: relative;
            `}
            style={{ y: pullMargin }}
          >
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <HomeTabPanel key={state.selectedKey} state={state} />
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HomeTabs;
