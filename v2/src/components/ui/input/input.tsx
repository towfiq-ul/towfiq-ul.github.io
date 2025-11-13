import * as React from "react";
import classNames from "classnames";
import styles from "./input.module.css";

const Input: React.FC<React.ComponentProps<"input">> = ({ className, type, ...props }) => {
  return <input type={type} className={classNames(styles.input, className)} {...props} />;
};
Input.displayName = "Input";

export { Input };
