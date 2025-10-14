import { css } from "@emotion/react";
import logo from "@/assets/logo/myfye_logo.svg";
import Card from "../../card/Card";
import Heading from "../../text/Heading";
import StockChart, { StockChartProps } from "./StockChart";

const StockChartCard = ({ name, ...restProps }: StockChartProps) => {
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
              height: calc(1.4em * var(--line-height-heading));
              transform: translateY(-0.22rem);
            `}
          />
          {name}
        </span>
      </Heading>
      <StockChart {...restProps} name={name} />
    </Card>
  );
};

export default StockChartCard;
