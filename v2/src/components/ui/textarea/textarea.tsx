import * as React from "react";
import classNames from "classnames";
import styles from "./textarea.module.css";

const Textarea: React.FC<React.ComponentProps<"textarea">> = ({ className, ...props }) => {
  return <textarea className={classNames(styles.textarea, className)} {...props} />;
};
Textarea.displayName = "Textarea";

export { Textarea };
