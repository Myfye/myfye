import Modal from "@/shared/components/ui/modal/Modal";
import EarnBreakdownModalPieChart from "./EarnBreakdownModalPieChart";
import { css } from "@emotion/react";
const getPercentage = (value: number) =>
  new Intl.NumberFormat("en-EN", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);
const EarnBreakdownModal = ({ isOpen, onOpenChange, data, zIndex }) => {
  return (
    <Modal
      zIndex={1001}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      height={667}
    >
      <section>
        <EarnBreakdownModalPieChart data={data} />
      </section>
      <section
        css={css`
          padding-inline: var(--size-200);
          margin-block-start: var(--size-200);
        `}
      >
        <div
          className="container"
          css={css`
            border-radius: var(--border-radius-medium);
            background-color: var(--clr-surface-raised);
            padding: var(--size-250);
            box-shadow: var(--box-shadow-card);
          `}
        >
          <ul
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-100);
            `}
          >
            {...data.map((datum) => {
              return (
                <li>
                  <div
                    css={css`
                      display: grid;
                      grid-template-columns: auto 1fr;
                      gap: var(--size-100);
                    `}
                  >
                    <div
                      css={css`
                        width: var(--size-200);
                        aspect-ratio: 1;
                        background-color: ${datum.color};
                        border-radius: var(--border-radius-circle);
                      `}
                    ></div>
                    <p
                      css={css`
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                      `}
                    >
                      <span
                        css={css`
                          font-size: var(--fs-small);
                          line-height: var(--line-height-tight);
                          font-weight: var(--fw-active);
                          color: var(--clr-text);
                        `}
                      >
                        {datum.label}
                      </span>
                      <span
                        css={css`
                          color: var(--clr-text-weaker);
                          font-size: var(--fs-x-small);
                          line-height: var(--line-height-tight);
                          margin-block-start: var(--size-025);
                        `}
                      >
                        {getPercentage(datum.value)}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </Modal>
  );
};

export default EarnBreakdownModal;
