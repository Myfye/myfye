import { css } from "@emotion/react";
import NumberPad, { NumberPadProps } from "../number-pad/NumberPad";
import AmountDisplay, {
  AmountDisplayProps,
} from "../amount-display/AmountDisplay";
import { Button as AriaButton } from "react-aria-components";
import IconCard, { IconCardContent } from "../card/IconCard";
import Button from "../button/Button";
import { ButtonProps } from "../button/button.types";
import AmountSelectorGroup, {
  AmountSelectorGroupProps,
} from "../amount-selector/AmountSelectorGroup";
import AmountSelector from "../amount-selector/AmountSelector";
import { ArrowDownIcon } from "@phosphor-icons/react";
import IconWrapper from "../icons/IconWrapper";

interface Action {
  props: IconCardContent;
  action: () => void;
}

interface Selector {
  id: string;
  label: string;
  value: string;
}

interface AmountSelectScreenProps {
  numberPadProps: NumberPadProps;
  amountDisplayProps: AmountDisplayProps;
  primaryAction?: Action;
  secondaryAction?: Action;
  onSubmit: () => void;
  submitButtonProps?: ButtonProps;
  amountSelectors?: Selector[];
  amountSelectorGroupProps?: AmountSelectorGroupProps;
  submitLabel?: string;
}
const AmountSelectScreen = ({
  numberPadProps,
  amountDisplayProps,
  primaryAction,
  secondaryAction,
  submitButtonProps,
  amountSelectors,
  onSubmit,
  amountSelectorGroupProps,
  submitLabel = "Next",
}: AmountSelectScreenProps) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100%;
        padding-block-end: var(--size-250);
      `}
    >
      <section
        css={css`
          padding-inline: var(--size-400);
        `}
      >
        <AmountDisplay {...amountDisplayProps} />
      </section>
      <section
        css={css`
          padding-inline: var(--size-400);
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          {amountSelectors && (
            <section
              css={css`
                padding-inline: var(--size-400);
              `}
            >
              <AmountSelectorGroup {...amountSelectorGroupProps}>
                {amountSelectors.map((selector) => (
                  <AmountSelector key={selector.id} value={selector.value}>
                    {selector.label}
                  </AmountSelector>
                ))}
              </AmountSelectorGroup>
            </section>
          )}
          {primaryAction && (
            <div
              css={css`
                margin-block-start: var(--size-250);
                border-radius: var(--border-radius-medium);
                background-color: var(--clr-surface-raised);
                padding: ${secondaryAction ? "var(--size-150)" : "0"};
              `}
            >
              <menu>
                <li>
                  <AriaButton
                    onPress={primaryAction.action}
                    css={css`
                      display: block;
                      width: 100%;
                    `}
                  >
                    <IconCard
                      padding={secondaryAction ? "0" : "var(--size-150)"}
                      backgroundColor="transparent"
                      height={secondaryAction ? "3.25rem" : "4.25rem"}
                      showArrow
                      {...primaryAction.props}
                    />
                  </AriaButton>
                </li>

                {secondaryAction && (
                  <>
                    <li
                      css={css`
                        display: grid;
                        place-items: center;
                        width: 2.75rem;
                        padding-block: var(--size-050);
                      `}
                    >
                      <ArrowDownIcon size={16} color="var(--clr-icon)" />
                    </li>
                    <li>
                      <AriaButton
                        onPress={secondaryAction.action}
                        css={css`
                          display: block;
                          width: 100%;
                        `}
                      >
                        <IconCard
                          padding="0px"
                          backgroundColor="transparent"
                          height="3.25rem"
                          showArrow
                          {...secondaryAction.props}
                        />
                      </AriaButton>
                    </li>
                  </>
                )}
              </menu>
            </div>
          )}
          <div
            css={css`
              margin-block-start: var(--size-200);
            `}
          >
            <NumberPad {...numberPadProps} />
          </div>
          <div
            css={css`
              margin-block-start: var(--size-250);
            `}
          >
            <Button
              {...submitButtonProps}
              expand
              variant="primary"
              onPress={onSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AmountSelectScreen;
