import Button from "@/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
} from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PieChart from "./pie-chart/PieChart";
import BalanceTitle from "../../BalanceTitle";
import CTACarousel from "./cta-carousel/CTACarousel";

const DashboardPanel = () => {
  return (
    <div
      className="dashboard-panel"
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: fit-content;
        height: 100%;
        > * {
          width: 100%;
        }
        padding-bottom: var(--size-250);
      `}
    >
      <section className="balance-container">
        <BalanceTitle balance={3218} />
        <menu
          className="no-scrollbar"
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: var(--controls-gap-small);
            overflow-x: auto;
            padding: 0 var(--size-250);
          `}
        >
          <li>
            <Button size="small" icon={ArrowCircleUpIcon}>
              Send
            </Button>
          </li>
          <li>
            <Button size="small" icon={ArrowCircleDownIcon}>
              Receive
            </Button>
          </li>
          <li>
            <Button size="small" icon={ArrowLineDownIcon}>
              Deposit
            </Button>
          </li>
          <li>
            <Button size="small" icon={ArrowLineUpIcon}>
              Withdraw
            </Button>
          </li>
        </menu>
      </section>
      <section
        className="pie-chart-container"
        css={css`
          min-height: 364px;
          height: 364px;
          margin-block-start: var(--size-200);
          padding: 0 var(--size-250);
        `}
      >
        <div
          className="pie-chart-wrapper"
          css={css`
            width: 100%;
            height: 100%;
          `}
        >
          <PieChart
            data={[
              {
                id: "Cash",
                label: "Cash",
                value: 321,
                color: "var(--clr-green-300)",
              },
              {
                id: "Crypto",
                label: "Crypto",
                value: 135,
                color: "var(--clr-green-400)",
              },
            ]}
          ></PieChart>
        </div>
      </section>
      <section className="cta-carousel-container">
        <CTACarousel
          slides={[
            {
              title: "Earn up to 4.6% APY with USDY",
              subtitle: "Invest with ONDO US Dollar Yield (USDY)",
              icon: "test",
            },
            { title: "Test", subtitle: "test", icon: "test" },
            { title: "Test", subtitle: "test", icon: "test" },
            { title: "Test", subtitle: "test", icon: "test" },
          ]}
        ></CTACarousel>
      </section>
    </div>
  );
};

export default DashboardPanel;
