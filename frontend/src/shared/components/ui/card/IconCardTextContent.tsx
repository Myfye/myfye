import { css } from "@emotion/react";

interface IconCardTextContentProps {
  title: string;
  subtitle?: string;
  titleSize?: "medium" | "large";
  titleWeight?: string;
  align?: "start" | "center" | "end";
  textAlign?: string;
  subtitleSize?: "medium" | "small";
}

const getTitleFontSize = (titleSize: "medium" | "large") => {
  if (titleSize === "medium") return "var(--fs-medium)";
  return "var(--fs-large)";
};

const getSubtitleFontSize = (subtitleSize: "medium" | "small") => {
  if (subtitleSize === "medium") return "var(--fs-medium)";
  return "var(--fs-small)";
};

const getAlignItems = (textAlign: string) => {
  switch (textAlign) {
    case "start": {
      return "flex-start";
    }
    case "center": {
      return "center";
    }
    case "end": {
      return "flex-end";
    }
    default: {
      return;
    }
  }
};

const IconCardTextContent = ({
  title,
  subtitle,
  titleSize = "medium",
  titleWeight = "var(--fw-active)",
  align = "start",
  textAlign = "start",
  subtitleSize = "medium",
}: IconCardTextContentProps) => {
  const titleFontSize = getTitleFontSize(titleSize);
  const subtitleFontSize = getSubtitleFontSize(subtitleSize);
  const alignItems = getAlignItems(textAlign);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-050);
        justify-content: ${align === "center" ? "center" : "flex-start"};
        align-items: ${alignItems};
      `}
    >
      <span
        css={css`
          font-size: ${titleFontSize};
          line-height: var(--line-height-tight);
          font-weight: ${titleWeight};
        `}
      >
        {title}
      </span>
      {subtitle && (
        <span
          css={css`
            font-size: ${subtitleFontSize};
            line-height: var(--line-height-tight);
            color: var(--clr-text-weaker);
          `}
        >
          {subtitle}
        </span>
      )}
      {!subtitle && align === "start" && (
        <span
          aria-hidden="true"
          css={css`
            width: 1px;
            height: calc(${subtitleFontSize} * var(--line-height-tight));
          `}
        ></span>
      )}
    </div>
  );
};

export default IconCardTextContent;
