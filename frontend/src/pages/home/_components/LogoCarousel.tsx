import { css } from "@emotion/react";

interface LogoCarouselProps {
  logos: {
    src: string;
    alt: string;
    width?: string;
    marginBlockStart?: string;
  }[];
}

const LogoCarousel = ({ logos }: LogoCarouselProps) => {
  return (
    <div className="logo-carousel-wrapper">
      <ul
        className="logo-carousel"
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        {logos.map((logo) => (
          <li>
            <img
              src={logo.src}
              alt={logo.alt}
              css={css`
                width: ${logo.width ? logo.width : "auto"};
                margin-block-start: ${logo.marginBlockStart
                  ? logo.marginBlockStart
                  : "0"};
              `}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogoCarousel;
