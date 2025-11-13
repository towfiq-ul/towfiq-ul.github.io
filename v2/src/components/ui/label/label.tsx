import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import classNames from "classnames";
import styles from "./label.module.css";

const Label: React.FC<React.ComponentProps<typeof LabelPrimitive.Root>> = ({ className, ...props }) => (
  <LabelPrimitive.Root className={classNames(styles.label, className)} {...props} />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
