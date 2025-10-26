import Card from "@/shared/components/ui/card/Card";
import EarnPieChart from "./EarnPieChart";
import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { PressEvent } from "react-aria";
import Heading from "@/shared/components/ui/text/Heading";
import logo from "@/assets/logo/myfye_logo.svg";

const EarnPieChartCard = ({
  onPress,
}: {
  onPress?: (e: PressEvent) => void;
}) => {
  return (
    <Card size="large">
      <Heading>
        <span
          css={css`
            display: flex;
            align-items: center;
            gap: var(--size-100);
          `}
        >
          <img
            src={logo}
            alt="Myfye"
            css={css`
              width: auto;
              height: calc(1.5em * var(--line-height-heading));
              transform: translateY(-0.22rem);
            `}
          />
          Earn
        </span>
      </Heading>
      <div
        css={css`
          position: relative;
          height: 12.75rem;
        `}
      >
        <div
          className="button-wrapper"
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            inset: 0;
            margin: auto;
            left: auto;
            right: var(--size-150);
            z-index: 2;
          `}
        >
          <Button size="x-small" color="neutral" onPress={onPress}>
            View breakdown
          </Button>
        </div>
        <div
          css={css`
            position: relative;
            z-index: 1;
          `}
        >
          <EarnPieChart />
        </div>
      </div>
    </Card>
  );
};

export default EarnPieChartCard;
