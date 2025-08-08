import { css } from "@emotion/react";

interface IconCardTextContentProps {
  title: string;
  description?: string;
  titleFontSize?: string;
  align?: "start" | "center";
}

const IconCardTextContent = ({
  title,
  description,
  titleFontSize = "var(--fs-medium)",
  align,
}: IconCardTextContentProps) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-050);
        align-items: ${align === "center" ? "center" : "flex-start"};
      `}
    >
      <span
        css={css`
          font-size: ${titleFontSize}
          line-height: var(--line-height-tight);
          font-weight: var(--fw-active);
        `}
      >
        {title}
      </span>
      {description && (
        <span
          css={css`
            font-size: var(--fs-small);
            line-height: var(--line-height-tight);
            color: var(--clr-text-weaker);
          `}
        >
          {description}
        </span>
      )}
    </div>
  );
};

export default IconCardTextContent;
