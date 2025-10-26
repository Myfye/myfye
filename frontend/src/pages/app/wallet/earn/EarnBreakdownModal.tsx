import Modal from "@/shared/components/ui/modal/Modal";
import { css } from "@emotion/react";
import PieChart from "../_components/PieChart";
import EarnBreakdownPieChartCard from "./EarnBreakdownPieChartCard";
import Stack from "@/shared/components/ui/primitives/stack/Stack";
import Section from "@/shared/components/layout/section/Section";
import Card from "@/shared/components/ui/card/Card";

const getPercentage = (value: number) =>
  new Intl.NumberFormat("en-EN", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);

const pieChartData = [
  {
    name: "First Citizens - Bank Deposits",
    y: 0.7,
    color: "var(--clr-green-500)",
  },
  {
    name: "StoneX - US T-Bills",
    y: 0.16,
    color: "var(--clr-blue-300)",
  },
  {
    name: "Morgan Stanley - Bank Deposits",
    y: 0.06,
    color: "var(--clr-blue-500)",
  },
  {
    name: "StoneX - Cash & Equivalents",
    y: 0.06,
    color: "var(--clr-blue-700)",
  },
  {
    name: "Morgan Stanley - US T-Notes",
    y: 0.05,
    color: "var(--clr-green-700)",
  },
  {
    name: "StoneX - US T-Notes",
    y: 0.03,
    color: "var(--clr-blue-400)",
  },
  {
    name: "First Citizens - Cash & Cash Deposits",
    y: 0.02,
    color: "var(--clr-green-400)",
  },
  {
    name: "Morgan Stanley - Cash & Cash Deposits",
    y: 0,
    color: "var(--clr-green-300)",
  },
];

interface EarnBreakdownModelProps {
  zIndex?: number;
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
}

const EarnBreakdownModal = ({
  isOpen,
  onOpenChange,
  zIndex = 1001,
}: EarnBreakdownModelProps) => {
  return (
    <Modal
      zIndex={zIndex}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      height={667}
    >
      <Stack gap="medium">
        <Section padding="small">
          <EarnBreakdownPieChartCard />
        </Section>
        <Section padding="small">
          <Card size="large">
            <Stack as="ul" gap="small" alignInline="start">
              {...pieChartData.map((datum) => {
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
                          {datum.name}
                        </span>
                        <span
                          css={css`
                            color: var(--clr-text-weaker);
                            font-size: var(--fs-x-small);
                            line-height: var(--line-height-tight);
                            margin-block-start: var(--size-025);
                          `}
                        >
                          {getPercentage(datum.y)}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </Stack>
          </Card>
        </Section>
      </Stack>
    </Modal>
  );
};

export default EarnBreakdownModal;
