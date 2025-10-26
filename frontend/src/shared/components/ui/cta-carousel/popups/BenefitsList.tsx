import { css } from "@emotion/react";
import { ReactNode } from "react";

interface BenefitsListProps {
  children?: ReactNode;
}

const BenefitsList = ({ children }: BenefitsListProps) => {
  return (
    <ul
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--size-300);
      `}
    >
      {children}
    </ul>
  );
};

export default BenefitsList;
