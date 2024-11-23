import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../libs/utils";

const typographyVariants = cva(
  "block break-words font-sofia text-cape-cod-950",
  {
    variants: {
      variant: {
        h1: "text-5xl font-semibold",
        h2: "text-3xl font-semibold",
        h3: "text-2xl font-semibold",
        h4: "text-lg font-semibold",
        h5: "text-lg font-normal",
        h6: "text-base font-semibold",
        p: "text-base font-normal",
        pMedium: "text-sm font-normal",
        pSmall: "text-xs font-normal",
        button: "text-base font-medium",
        menuItem: "text-base font-normal",
      },
    },
    defaultVariants: {
      variant: "p",
    },
  }
);

type VariantPropType = VariantProps<typeof typographyVariants>;

const variantElementMap: Record<
  NonNullable<VariantPropType["variant"]>,
  string
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  pSmall: "p",
  pMedium: "p",
  button: "p",
  menuItem: "p",
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  as?: string;
  ref?: React.Ref<HTMLElement>;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, asChild, ...props }, ref) => {
    const Comp = asChild
      ? Slot
      : as ?? (variant ? variantElementMap[variant] : undefined) ?? "div";

    return (
      <Comp
        className={cn(typographyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };

export const H1 = (props: TypographyProps) => (
  <Typography variant="h1" {...props} />
);

export const H2 = (props: TypographyProps) => (
  <Typography variant="h2" {...props} />
);

export const H3 = (props: TypographyProps) => (
  <Typography variant="h3" {...props} />
);

export const H4 = (props: TypographyProps) => (
  <Typography variant="h4" {...props} />
);

export const H5 = (props: TypographyProps) => (
  <Typography variant="h5" {...props} />
);

export const H6 = (props: TypographyProps) => (
  <Typography variant="h6" {...props} />
);

export const P = (props: TypographyProps) => (
  <Typography variant="p" {...props} />
);

export const PMedium = (props: TypographyProps) => (
  <Typography variant="pMedium" {...props} />
);

export const PSmall = (props: TypographyProps) => (
  <Typography variant="pSmall" {...props} />
);

export const ButtonText = (props: TypographyProps) => (
  <Typography variant="button" {...props} />
);

export const MenuItem = (props: TypographyProps) => (
  <Typography variant="menuItem" {...props} />
);
