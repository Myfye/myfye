import { useCopyAndPaste } from "@/features/copy-and-paste/useCopyAndPaste";
import Button from "@/shared/components/ui/button/Button";
import { css } from "@emotion/react";
import { Check, Copy } from "@phosphor-icons/react";
import { useEffect } from "react";
import { AriaButtonProps } from "react-aria";
import { Button as AriaButton } from "react-aria-components";

const BankDepositDetailsListItem = ({
  title,
  content,
  copyContent,
  ...restProps
}: AriaButtonProps & {
  title: string;
  content: string;
  copyContent: string;
}) => {
  const { isCopied, onCopy } = useCopyAndPaste(copyContent);

  return (
    <li
      css={css`
        width: 100%;
      `}
    >
      <AriaButton
        {...restProps}
        onPress={(e) => {
          restProps.onPress && restProps.onPress(e);
          onCopy();
        }}
        css={css`
          width: 100%;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--size-050);
            `}
          >
            <span className="heading-small">{title}</span>
            <span
              className="caption"
              css={css`
                color: var(--clr-text-weak);
              `}
            >
              {content}
            </span>
          </div>
          <div>
            {isCopied ? (
              <Check size={24} color="var(--clr-primary)" />
            ) : (
              <Copy size={24} />
            )}
          </div>
        </div>
      </AriaButton>
    </li>
  );
};

export default BankDepositDetailsListItem;
