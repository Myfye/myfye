import { css } from "@emotion/react";

interface TransactionTableProps {
  items: { key: string; value: string }[];
}

const TransactionTable = ({ items }: TransactionTableProps) => {
  return (
    <div
      className="transaction-table"
      css={css`
        background-color: var(--clr-surface-raised);
        border-radius: var(--border-radius-medium);
      `}
    >
      <table
        css={css`
          width: 100%;
        `}
      >
        <tbody
          css={css`
            & td {
              padding-block: var(--size-150);
              padding-inline: var(--size-150);
            }
            > tr + tr {
              border-top: 1px solid var(--clr-surface);
            }
          `}
        >
          {items.map((item) => (
            <tr>
              <td
                css={css`
                  font-size: var(--fs-medium);
                `}
              >
                {item.key}
              </td>
              <td
                css={css`
                  font-size: var(--fs-medium);
                  text-align: right;
                `}
              >
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
