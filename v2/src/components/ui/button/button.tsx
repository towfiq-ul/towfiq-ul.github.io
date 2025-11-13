import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import classNames from "classnames";
import styles from "./button.module.css";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={classNames(
        styles.base,
        styles[variant],
        styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
        className
      )}
      {...props}
    />
  );
};
Button.displayName = "Button";

export { Button };
