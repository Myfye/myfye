import { css } from "@emotion/react";
import { ReactNode } from "react";

interface MFAOnboardingStepListProps {
  children?: ReactNode;
}

const MFAOnboardingStepList = ({ children }: MFAOnboardingStepListProps) => {
  return (
    <div
      css={css`
        height: 12.5rem;
      `}
    >
      <ul>{children}</ul>
    </div>
  );
};

export default MFAOnboardingStepList;
