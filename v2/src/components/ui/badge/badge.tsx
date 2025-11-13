import * as React from "react";
import classNames from "classnames";
import styles from "./badge.module.css";

interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <div className={classNames(styles.badge, styles[variant], className)} {...props} />;
}

export { Badge };
