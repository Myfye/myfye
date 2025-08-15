import { css } from "@emotion/react";

interface IconCardTextContentProps {
  title: string;
  subtitle?: string;
  titleSize?: "medium" | "large";
  titleWeight?: string;
  align?: "start" | "center" | "end";
  textAlign?: string;
}

const getFontSize = (titleSize: "medium" | "large") => {
  if (titleSize === "medium") return "var(--fs-medium)";
  return "var(--fs-large)";
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
}: IconCardTextContentProps) => {
  const fontSize = getFontSize(titleSize);
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
          font-size: ${fontSize};
          line-height: var(--line-height-tight);
          font-weight: ${titleWeight};
        `}
      >
        {title}
      </span>
      {subtitle && (
        <span
          css={css`
            font-size: var(--fs-medium);
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
            height: calc(var(--fs-medium) * var(--line-height-tight));
            font-size: var(--fs-medium);
            line-height: var(--line-height-tight);
            color: var(--clr-text-weaker);
          `}
        ></span>
      )}
    </div>
  );
};

export default IconCardTextContent;
