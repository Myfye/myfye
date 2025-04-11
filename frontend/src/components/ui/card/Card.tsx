import { css } from "@emotion/react";
import { ArrowRight, Icon } from "@phosphor-icons/react";

const Card = ({
  title,
  icon,
  size = "medium",
  action,
  caption,
}: {
  title: any;
  size: string;
  action: Function;
  icon: Icon;
  caption: string;
}) => {
  const Icon = icon;
  return (
    <div
      css={css`
        padding: var(--size-250);
        border-radius: var(--border-radius-medium);
        background-color: var(--clr-surface-raised);
        box-shadow: var(--box-shadow-card);
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--size-200);
        `}
      >
        <div
          css={css`
            display: grid;
            place-items: center;
            width: var(--size-500);
            aspect-ratio: 1;
            background-color: var(--clr-green-200);
            border-radius: var(--border-radius-medium);
          `}
        >
          <Icon color="var(--clr-green-500)" size={24} />
        </div>
        <div>
          <p className="heading-small">{title}</p>
          <p
            className="caption-small"
            css={css`
              margin-block-start: var(--size-050);
              color: var(--clr-text-weaker);
            `}
          >
            {caption}
          </p>
          <p
            className="caption-small"
            css={css`
              display: flex;
              align-items: center;
              gap: var(--size-050);
              margin-block-start: var(--size-200);
              color: var(--clr-accent);
            `}
          >
            Learn more <ArrowRight size={16} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
