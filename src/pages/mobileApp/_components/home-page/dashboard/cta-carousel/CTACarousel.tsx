// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import CTACard from "./CTACard";
import { Pagination } from "swiper/modules";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const CTACarousel = ({ slides }) => {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      modules={[Pagination]}
      pagination={{
        dynamicBullets: true,
      }}
      css={css`
        margin-block-start: var(--size-500);
        padding-bottom: var(--size-500);
        --swiper-theme-color: var(--clr-text);
        --swiper-pagination-bullet-inactive-color: var(--clr-surface-lowered);
        --swiper-pagination-bullet-inactive-opacity: 1;
      `}
    >
      {slides.map((slide) => (
        <SwiperSlide>
          <div
            className="slide-inner"
            css={css`
              display: grid;
              place-items: center;
            `}
          >
            <CTACard
              title={slide.title}
              icon={slide?.icon}
              subtitle={slide?.subtitle}
            ></CTACard>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CTACarousel;
