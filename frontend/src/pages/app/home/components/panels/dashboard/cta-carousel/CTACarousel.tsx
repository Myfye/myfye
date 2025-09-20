// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import { css } from "@emotion/react";
import IconCard from "@/shared/components/ui/card/IconCard";
import { Icon } from "@phosphor-icons/react";
import { Button } from "react-aria-components";
import { useState } from "react";

interface Slide {
  icon: string | Icon;
  title: string;
  subtitle: string;
  action: () => void;
}

interface CTACarouselProps {
  slides: Slide[];
}

const CTACarousel = ({ slides }: CTACarouselProps) => {
  const [isDragging, setDragging] = useState(false);
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      modules={[Pagination]}
      onDragStart={() => {
        setDragging(true);
        console.log("dragging");
      }}
      onDragEnd={() => setDragging(false)}
      pagination={{
        dynamicBullets: false,
      }}
      onTap={(swiper) => {
        const currentIndex = swiper.activeIndex;
        if (slides[currentIndex]) {
          slides[currentIndex].action();
        }
      }}
      css={css`
        padding-block-start: var(--size-025);
        padding-block-end: var(--size-250);
        --swiper-theme-color: var(--clr-text);
        --swiper-pagination-bullet-inactive-color: var(--clr-surface-lowered);
        --swiper-pagination-bullet-inactive-opacity: 1;
        --swiper-pagination-bottom: 0;
      `}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={`slide=${i}`}>
          <div
            className="slide-inner"
            css={css`
              display: block;
              width: 100%;
              padding-inline: var(--size-250);
            `}
          >
            <IconCard
              height="5.25rem"
              padding="var(--size-200)"
              icon={slide.icon}
              leftContent={{
                title: slide.title,
                subtitle: slide.subtitle,
                subtitleSize: "small",
              }}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CTACarousel;
