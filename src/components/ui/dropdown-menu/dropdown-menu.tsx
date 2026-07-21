import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import classNames from "classnames";
import styles from "./dropdown-menu.module.css";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger: React.FC<
  React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
> = ({ className, inset, children, ...props }) => (
  <DropdownMenuPrimitive.SubTrigger
    className={classNames(styles.subTrigger, inset && styles.inset, className)}
    {...props}
  >
    {children}
    <ChevronRight className={styles.icon} />
  </DropdownMenuPrimitive.SubTrigger>
);
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>> = ({
  className,
  ...props
}) => <DropdownMenuPrimitive.SubContent className={classNames(styles.content, className)} {...props} />;
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Content>> = ({
  className,
  sideOffset = 4,
  ...props
}) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={classNames(styles.content, className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }> = ({
  className,
  inset,
  ...props
}) => <DropdownMenuPrimitive.Item className={classNames(styles.item, inset && styles.inset, className)} {...props} />;
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>> = ({
  className,
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.CheckboxItem className={classNames(styles.checkbox, className)} {...props}>
    <span className={styles.indicator}>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className={styles.icon} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>> = ({
  className,
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.RadioItem className={classNames(styles.checkbox, className)} {...props}>
    <span className={styles.indicator}>
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className={styles.circleIcon} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }> = ({
  className,
  inset,
  ...props
}) => <DropdownMenuPrimitive.Label className={classNames(styles.label, inset && styles.inset, className)} {...props} />;
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Separator>> = ({
  className,
  ...props
}) => <DropdownMenuPrimitive.Separator className={classNames(styles.separator, className)} {...props} />;
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span className={classNames(styles.shortcut, className)} {...props} />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
