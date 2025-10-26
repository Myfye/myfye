import { css } from "@emotion/react";
import Button from "../button/Button";
import Caption from "../text/Caption";
import Heading from "../text/Heading";
import Card from "./Card";
import Stack from "../primitives/stack/Stack";
import { Icon, IconProps } from "@phosphor-icons/react";
import { ReactNode } from "react";
import logo from "@/assets/logo/myfye_logo.svg";

type Props = {
  title: ReactNode | string;
  caption?: ReactNode | string;
  action?: () => void;
  cta?: string;
  image?: {
    src: string | Icon;
    alt: string;
  };
};

const renderIcon = (icon: Icon, props: IconProps) => {
  const Icon = icon;
  return <Icon {...props} />;
};

const ZeroBalanceCard = ({ title, caption, action, cta, image }: Props) => {
  return (
    <Card size="x-large">
      <Stack gap="none">
        {image && (
          <div
            css={css`
              margin-block-end: var(--size-200);
            `}
          >
            {typeof image.src === "string" && <img />}
            {typeof image.src !== "string" &&
              renderIcon(image.src, {
                "aria-label": image.alt,
                size: 64,
                weight: "light",
                color: "var(--clr-primary)",
              })}
          </div>
        )}
        <Heading align="center" marginBottom="var(--size-100)">
          {title}
        </Heading>
        <Caption
          align="center"
          color="var(--clr-text-weaker)"
          marginBottom="var(--size-250)"
        >
          {caption}
        </Caption>
        {action && <Button onPress={action}>{cta}</Button>}
      </Stack>
    </Card>
  );
};

export default ZeroBalanceCard;
