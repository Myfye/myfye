import { css } from "@emotion/react";
import { Icon } from "@phosphor-icons/react";

interface BenefitsListItemProps {
  title: string;
  description: string;
  icon: Icon;
}

const BenefitsListItem = ({
  title,
  description,
  icon,
}: BenefitsListItemProps) => {
  const Icon = icon;
  return (
    <li>
      <div
        css={css`
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--size-150);
        `}
      >
        <div
          className="icon-wrapper"
          css={css`
            display: grid;
            place-items: center;
            aspect-ratio: 1;
            width: var(--size-500);
            border-radius: var(--border-radius-circle);
            background-color: var(--clr-green-100);
          `}
        >
          <Icon size={24} color="var(--clr-primary)" />
        </div>
        <div>
          <div>
            <span
              className="heading-small"
              css={css`
                color: var(--clr-text);
              `}
            >
              {title}
            </span>
          </div>
          <div>
            <span
              className="caption-small"
              css={css`
                color: var(--clr-text-weaker);
              `}
            >
              {description}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BenefitsListItem;
