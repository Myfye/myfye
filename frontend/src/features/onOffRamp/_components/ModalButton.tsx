import { css } from "@emotion/react";
import { ButtonHTMLAttributes, RefObject, useMemo, useRef } from "react";
import { ButtonContext, useContextProps } from "react-aria-components";
import { AriaButtonProps, useButton } from "react-aria";
import { motion, MotionProps } from "motion/react";
import { Icon } from "@phosphor-icons/react";

interface ModalButtonProps extends AriaButtonProps {
  icon: Icon;
  title?: string;
  description?: string;
  ref?: RefObject<HTMLButtonElement>;
}
const ModalButton = ({
  icon,
  title,
  description,
  ref,
  ...restProps
}: ModalButtonProps) => {
  const Icon = icon;

  if (!ref) ref = useRef<HTMLButtonElement>(null!);
  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    <motion.button
      {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement> &
        MotionProps)}
      ref={ref}
      animate={{
        scale: isPressed ? 0.98 : 1,
      }}
      className="modal-button"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: var(--size-150);
        line-height: var(--line-height-tight);
        width: 100%;
        padding: var(--size-150);
        border-radius: var(--border-radius-medium);
        background-color: var(--clr-surface-raised);
      `}
    >
      <div
        className="icon-wrapper"
        css={css`
          display: grid;
          place-items: center;
          width: 2.75rem;
          aspect-ratio: 1;
          background-color: var(--clr-green-100);
          border-radius: var(--border-radius-medium);
        `}
      >
        <Icon size={32} color="var(--clr-primary)" />
      </div>
      <div
        className="content"
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          align-self: center;
        `}
      >
        <p
          className="title"
          css={css`
            font-size: var(--fs-medium);
            line-height: var(--line-height-tight);
            font-weight: var(--fw-active);
          `}
        >
          {title}
        </p>
        <p
          className="description"
          css={css`
            font-size: var(--fs-small);
            line-height: var(--line-height-tight);
            color: var(--clr-text-weaker);
            margin-block-start: var(--size-050);
          `}
        >
          {description}
        </p>
      </div>
    </motion.button>
  );
};

export default ModalButton;
