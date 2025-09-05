import { css } from "@emotion/react";
import { type Icon } from "@phosphor-icons/react";

interface MockupNotificationProps {
  icon: Icon;
  title: string;
  subtitle: string;
  inset?: string;
}

const MockupNotification = ({
  icon,
  title,
  subtitle,
  inset = "0",
}: MockupNotificationProps) => {
  const Icon = icon;
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--size-200);
        background-color: var(--clr-white);
        border-radius: var(--border-radius-large);
        border: 1px solid #c7c7c7;
        padding: var(--size-200);
        position: absolute;
        inset: ${inset};
        margin: auto;
        width: fit-content;
        height: fit-content;
      `}
    >
      <Icon size={40} color="var(--clr-primary)" />
      <div>
        <div>
          <span
            css={css`
              font-weight: 600;
              color: #686868;
              font-size: var(--fs-medium);
            `}
          >
            {title}
          </span>
        </div>
        <div>
          <span
            css={css`
              font-weight: 700;
              color: var(--clr-text);
              font-size: 1.25rem;
              margin-block-start: var(--size-025);
            `}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MockupNotification;
