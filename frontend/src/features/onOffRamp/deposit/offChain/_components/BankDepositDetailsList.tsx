import { css } from "@emotion/react";

const BankDepositDetailsList = ({ children }) => {
  return (
    <div>
      <ul
        css={css`
          display: flex;
          flex-direction: column;
          gap: var(--size-200);
        `}
      >
        {children}
      </ul>
    </div>
  );
};

export default BankDepositDetailsList;
