import Modal from "@/shared/components/ui/modal/Modal";
import { css } from "@emotion/react";
import PieChart from "../_components/PieChart";
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
  data: {
    name: string;
    y: number;
    color: string;
  }[];
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
}

const EarnBreakdownModal = ({
  isOpen,
  onOpenChange,
  data,
  zIndex = 1001,
}: EarnBreakdownModelProps) => {
  const pieChartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 200,
      backgroundColor: "transparent",
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      spacingTop: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    plotOptions: {
      pie: {
        borderWidth: 2,
        center: ["50%", "45%"],
        showInLegend: true,
        innerSize: "60%",
        size: "90%",
        depth: 45,
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: false,
          },
        ],
      },
    },
    title: {
      text: "<span class='earn-breakdown-title-main'>Earn</br>Breakdown</span>",
      floating: true,
      x: 0,
      y: 85,
      style: {
        fontSize: "17px",
        fontWeight: "600",
        fontFamily: "Inter",
        color: "var(--clr-text)",
      },
    },
    tooltip: {
      enabled: true,
      pointFormat: "Balance: <b>${point.y:.2f}</b>",
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      // @ts-ignore
      {
        name: "Earn breakdown",
        colorByPoint: true,
        data: pieChartData,
      },
    ],
  };
  return (
    <Modal
      zIndex={zIndex}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      height={667}
    >
      <section
        css={css`
          padding-inline: var(--size-200);
        `}
      >
        <div
          css={css`
            padding: var(--size-150);
            border-radius: var(--border-radius-medium);
            background-color: var(--clr-surface-raised);
            overflow: hidden;
            height: 13rem;
          `}
        >
          <PieChart options={pieChartOptions} />
        </div>
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
            padding: var(--size-200);
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
          </ul>
        </div>
      </section>
    </Modal>
  );
};

export default EarnBreakdownModal;
