import { css } from "@emotion/react";
import LogoCarousel from "./LogoCarousel";
import paypalLogo from "@/assets/logo_carousel/Paypal Logo.svg";
import venmoLogo from "@/assets/logo_carousel/Venmo Logo.svg";
import ondoFinanceLogo from "@/assets/logo_carousel/Ondo Finance Logo.svg";
import etherFuseLogo from "@/assets/logo_carousel/EtherFuse Logo.svg";

const logos = [
  { src: paypalLogo, alt: "PayPal", width: "150px" },
  { src: venmoLogo, alt: "Venmo", width: "164px" },
  { src: ondoFinanceLogo, alt: "Ondo Finance", width: "170px" },
  { src: etherFuseLogo, alt: "EtherFuse", width: "198px" },
];

const PoweredBy = () => {
  return (
    <section
      className="powered-by | content-grid"
      css={css`
        background-color: var(--clr-white);
      `}
    >
      <div
        css={css`
          margin-block: 12rem;
        `}
      >
        <h2
          css={css`
            font-size: 1.25rem;
            line-height: var(--line-height-caption);
            text-align: center;
            color: #696969;
            margin-block-end: var(--size-500);
          `}
        >
          Powered by
        </h2>
        <LogoCarousel logos={logos} />
      </div>
    </section>
  );
};

export default PoweredBy;
