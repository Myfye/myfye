import { css } from "@emotion/react";
import Card from "../card/Card";
import PieChart3D, { PieChart3DProps } from "./PieChart3D";
import logo from "@/assets/logo/myfye_logo.svg";
import Heading from "../text/Heading";

const PieChart3DCard = ({ name, ...restProps }: PieChart3DProps) => {
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
              transform: translateY(-0.1rem);
            `}
          />
          {name}
        </span>
      </Heading>
      <PieChart3D {...restProps} name={name} />
    </Card>
  );
};

export default PieChart3DCard;
