import { css } from "@emotion/react";

interface InvestCarouselSlide {
  ticker: string;
  price: number;
  percentChange: number;
}
const InvestCarouselSlide = ({
  ticker,
  price,
  percentChange,
}: InvestCarouselSlide) => {
  return (
    <li>
      <div
        css={css`
          aspect-ratio: 1;
          border-radius: var(--border-radius-large);
          background: linear-gradient(
            to bottom,
            0% transparent,
            100% var(--clr-green)
          );
          border: 1px solid var(--clr-neutral-300);
          padding: var(--size-200);
        `}
      >
        <ul
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
          `}
        >
          <li
            className="ticker"
            css={css`
              line-height: var(--line-height-tight);
              font-size: var(--fs-x-large);
              font-weight: var(--fw-heading);
              color: var(--clr-text);
            `}
          >
            {ticker}
          </li>
          <li
            className="price"
            css={css`
              margin-block-start: var(--size-100);
              font-size: var(--fs-3x-large);
              font-weight: var(--fw-heading);
              color: var(--clr-text);
            `}
          >
            {new Intl.NumberFormat("en-EN", {
              style: "currency",
              currency: "usd",
            }).format(price)}
          </li>
          <li
            className="percent-change"
            css={css`
              margin-block-start: auto;
              line-height: var(--line-height-tight);
              font-size: var(--fs-medium);
              color: ${percentChange < 0
                ? "var(--clr-red)"
                : "var(--clr-primary)"};
            `}
          >
            {new Intl.NumberFormat("en-EN", {
              style: "percent",
              minimumSignificantDigits: 2,
              signDisplay: "always",
            }).format(percentChange)}
          </li>
        </ul>
      </div>
    </li>
  );
};

export default InvestCarouselSlide;
