import Button from "@/shared/components/ui/button/Button";
import { css } from "@emotion/react";
import {
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { UIEvent, useEffect, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components";

import selfCustodyImage from "@/assets/features_carousel/self-custody.jpeg";
import sendImage from "@/assets/features_carousel/send.jpeg";
import earnImage from "@/assets/features_carousel/earn.jpeg";
import stocksImage from "@/assets/features_carousel/stocks.jpeg";
import ProductFeaturesCarouselFeaturedImage from "./ProductFeaturesCarouselFeaturedImage";
import ProductFeaturesCarouselContent from "./ProductsFeatureCarouselContent";

export type FeatureSlide = {
  id: string;
  title: string;
  description: string;
  actionTitle: string;
  action: () => void;
  image: { src: string; alt: string };
};

const featureSlides = [
  {
    id: "1",
    title: "Self-Custody",
    description:
      "Secure all your assets directly on your phone with 24/7 access, no banks required.",
    image: {
      src: selfCustodyImage,
      alt: "Woman walking with phone in hand",
    },
    actionTitle: "Create a wallet",
    action: () => {},
  },
  {
    id: "2",
    title: "Send",
    description:
      "Stay connected to family and friends with instant, free global payments.",
    image: {
      src: sendImage,
      alt: "Man and woman looking at phone together",
    },
    actionTitle: "Send money",
    action: () => {},
  },
  {
    id: "3",
    title: "Earn",
    description:
      "High-yield savings you can trust and access whenever you need, backed by actual high-grade assets.",
    image: {
      src: earnImage,
      alt: "Woman holding cash",
    },
    actionTitle: "Earn with treasuries",
    action: () => {},
  },
  {
    id: "4",
    title: "Invest",
    description:
      "Access global markets with over 50+ stocks, ETFs, commodities, and crypto options.",
    image: {
      src: stocksImage,
      alt: "Woman looking at phone with company logos in background",
    },
    actionTitle: "Invest in assets",
    action: () => {},
  },
];

const getScrollPosition = (id: string, startY: number, elHeight: number) => {
  switch (id) {
    case "1": {
      return startY;
    }
    case "2": {
      return startY + elHeight * (1 / 5);
    }
    case "3": {
      return startY + elHeight * (2 / 5);
    }
    case "4": {
      return startY + elHeight * (3 / 5);
    }
    default: {
      throw new Error("Unknown id");
    }
  }
};

interface ProductFeaturesCarouselProps {
  features?: FeatureSlide[];
}

const ProductFeaturesCarousel = ({
  features = featureSlides,
}: ProductFeaturesCarouselProps) => {
  const [selectedFeature, setSelectedFeature] = useState(features[0].id);
  const [startY, setStartY] = useState(0);
  const [elHeight, setElHeight] = useState(0);
  const [ignoreScroll, setIgnoreScroll] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (ignoreScroll) {
      setIgnoreScroll(false);
      return;
    }
    if (latest < startY + elHeight * (1 / 5)) {
      if (selectedFeature !== features[0].id)
        return setSelectedFeature(features[0].id);
    }
    if (
      startY + elHeight * (1 / 5) <= latest &&
      latest < startY + elHeight * (2 / 5)
    ) {
      if (selectedFeature !== features[1].id)
        return setSelectedFeature(features[1].id);
    }
    if (
      startY + elHeight * (2 / 5) <= latest &&
      latest < startY + elHeight * (3 / 5)
    ) {
      if (selectedFeature !== features[2].id)
        return setSelectedFeature(features[2].id);
    }
    if (
      startY + elHeight * (3 / 5) <= latest &&
      latest < startY + elHeight * (4 / 5)
    ) {
      if (selectedFeature !== features[3].id)
        return setSelectedFeature(features[3].id);
    }
  });

  useEffect(() => {
    const el = ref.current;
    if (el) {
      // get element bounding box
      const bb = el.getBoundingClientRect();
      setStartY(Math.floor(bb.top + window.scrollY));
      setElHeight(bb.height);
    }
  });

  return (
    <div
      ref={ref}
      className="product-feature-carousel-wrapper"
      css={css`
        background-color: var(--clr-primary);
        height: ${features.length * 100}svh;
      `}
    >
      <div
        className="product-feature-carousel"
        css={css`
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--size-200);
          position: sticky;
          top: 0;
          height: 100svh;
          padding-block: 6rem;
        `}
      >
        <ProductFeaturesCarouselContent
          features={features}
          onFeatureSelect={(id) => {
            setSelectedFeature(id);
            // get position
            const position = getScrollPosition(id, startY, elHeight);
            setIgnoreScroll(true);
            window.scrollTo({ top: position });
          }}
          selectedFeature={selectedFeature}
        />
        <ProductFeaturesCarouselFeaturedImage
          selectedFeature={selectedFeature}
          features={features}
        />
      </div>
    </div>
  );
};

export default ProductFeaturesCarousel;
