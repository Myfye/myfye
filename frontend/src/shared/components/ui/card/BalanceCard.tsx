import { FiatCurrency } from "@/types/fiatCurrency.types";
import Card, { CardProps } from "./Card";
import { Heading } from "react-aria-components";
import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import Text from "../text/Text";
import { ElementType } from "react";

type Props = {
  balance: number;
  currency?: FiatCurrency;
  titleAs?: ElementType;
} & CardProps;

const BalanceCard = ({
  balance,
  currency = "usd",
  titleAs = "h2",
  ...restProps
}: Props) => (
  <Card width="fullWidth" {...restProps}>
    <hgroup>
      <Text
        as={titleAs}
        weight="var(--fw-default)"
        color="var(--clr-text-weaker)"
        size="small"
        marginBottom="var(--size-075)"
        leading="var(--line-height-tight)"
      >
        Balance
      </Text>
      <Text
        as="p"
        weight="var(--fw-heading)"
        color="var(--clr-text)"
        size="3x-large"
        leading="var(--line-height-tight)"
      >
        {formatAmountWithCurrency(balance, currency)}
      </Text>
    </hgroup>
  </Card>
);

export default BalanceCard;
