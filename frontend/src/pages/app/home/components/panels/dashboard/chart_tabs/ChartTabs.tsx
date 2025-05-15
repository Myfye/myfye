import {
  Collection,
  Key,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import PortfolioTab from "./PortfolioTab";
import PerformanceTab from "./PerformanceTab";

let tabs = [
  { id: "portfolio", label: "Portfolio" },
  { id: "performance", label: "Performance" },
];

function ChartTabs() {
  const [selectedKey, setSelectedKey] = useState<Key>(tabs[0].id);
  const [tabsRef, animate] = useAnimate();

  const tabListRef = useRef<HTMLDivElement>(null!);

  // Find all the tab elements so we can use their dimensions.
  const [tabElements, setTabElements] = useState<NodeListOf<Element> | []>([]);
  useEffect(() => {
    if (tabElements.length === 0) {
      const tabs = tabListRef.current.querySelectorAll("[role=tab]");
      setTabElements(tabs);
    }
  }, [tabElements]);

  const onSelectionChange = async (selectedKey: Key) => {
    setSelectedKey(selectedKey);
    const index = tabs.findIndex((tab) => tab.id === selectedKey);
    const currentTab = tabElements[index];
    animate(
      "[data-selection-indicator]",
      {
        x: currentTab?.offsetLeft,
        width: currentTab?.offsetWidth,
      },
      { duration: 0.2, ease: "easeOut" }
    );
  };

  useEffect(() => {
    const currentTab = tabElements[0];
    animate(
      "[data-selection-indicator]",
      {
        x: currentTab?.offsetLeft,
        width: currentTab?.offsetWidth,
      },
      { duration: 0.001, ease: "easeOut" }
    );
  }, [tabElements]);

  return (
    <AnimatePresence>
      <Tabs
        ref={tabsRef}
        css={css`
          width: 100%;
          padding-inline: var(--size-250);
        `}
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
      >
        <div
          css={css`
            overflow: hidden;
          `}
        >
          <Collection items={tabs}>
            {(tab) => (
              <TabPanel
                css={css`
                  width: 100%;
                `}
              >
                <div
                  css={css`
                    width: 100%;
                    max-height: 16.5rem;
                    touch-action: none;
                  `}
                >
                  {tab.id === "portfolio" && <PortfolioTab />}
                  {tab.id === "performance" && <PerformanceTab />}
                </div>
              </TabPanel>
            )}
          </Collection>
        </div>
        <div
          className="relative"
          css={css`
            --_extra-padding: var(--size-050);
            display: flex;
            justify-content: center;
            position: relative;
            isolation: isolate;
            margin-block-start: var(--size-150);
          `}
        >
          <TabList
            ref={tabListRef}
            css={css`
              display: inline-flex;
              gap: var(--size-050);
              width: fit-content;
              padding: var(--_extra-padding);
              border-radius: var(--border-radius-pill);
              background-color: var(--clr-surface-raised);
              font-weight: var(--fw-active);
              border: 1px solid var(--clr-border-neutral);
            `}
            items={tabs}
          >
            {(tab) => (
              <Tab
                css={css`
                  display: grid;
                  place-items: center;
                  height: var(--control-size-small);
                  padding-inline: var(--control-padding-inline-small);
                  font-size: var(--fs-medium);
                  color: var(--clr-primary);
                  user-select: none;
                  touch-action: none;
                  &[data-selected="true"] {
                    color: var(--clr-white);
                  }
                `}
              >
                <span
                  css={css`
                    position: relative;
                    z-index: 2;
                  `}
                >
                  {tab.label}
                </span>
              </Tab>
            )}
          </TabList>
          {/* Selection indicator. */}
          <motion.span
            data-selection-indicator
            css={css`
              position: absolute;
              z-index: 1;
              inset: 0;
              top: 50%;
              bottom: auto;
              translate: 0 -50%;
              background-color: var(--clr-primary);
              border-radius: var(--border-radius-pill);
              height: var(--control-size-small);
            `}
          />
        </div>
      </Tabs>
    </AnimatePresence>
  );
}

export default ChartTabs;
