import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import classNames from "classnames";
import styles from "./toast.module.css";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport: React.FC<React.ComponentProps<typeof ToastPrimitive.Viewport>> = ({ className, ...props }) => (
  <ToastPrimitive.Viewport className={classNames(styles.viewport, className)} {...props} />
);
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

interface ToastProps extends React.ComponentProps<typeof ToastPrimitive.Root> {
  variant?: "default" | "destructive";
}

const Toast: React.FC<ToastProps> = ({ className, variant = "default", ...props }) => (
  <ToastPrimitive.Root
    className={classNames(styles.toast, variant === "destructive" && styles.destructive, className)}
    {...props}
  />
);
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastAction: React.FC<React.ComponentProps<typeof ToastPrimitive.Action>> = ({ className, ...props }) => (
  <ToastPrimitive.Action className={classNames(styles.action, className)} {...props} />
);
ToastAction.displayName = ToastPrimitive.Action.displayName;

const ToastClose: React.FC<React.ComponentProps<typeof ToastPrimitive.Close>> = ({ className, ...props }) => (
  <ToastPrimitive.Close className={classNames(styles.close, className)} toast-close="" {...props}>
    <X className={styles.icon} />
  </ToastPrimitive.Close>
);
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle: React.FC<React.ComponentProps<typeof ToastPrimitive.Title>> = ({ className, ...props }) => (
  <ToastPrimitive.Title className={classNames(styles.title, className)} {...props} />
);
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription: React.FC<React.ComponentProps<typeof ToastPrimitive.Description>> = ({
  className,
  ...props
}) => <ToastPrimitive.Description className={classNames(styles.description, className)} {...props} />;
ToastDescription.displayName = ToastPrimitive.Description.displayName;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export type { ToastProps, ToastActionElement };
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };
