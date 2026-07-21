import { Sun, Moon, Monitor } from "lucide-react";
import { useColorScheme } from "../../../hooks/use-color-scheme";
import { Button } from "../button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import style from "./color-scheme-toggle.module.css";

interface ColorSchemeToggleProps {
  /**
   * @important
   * @default false
   */
  triggerText?: boolean;
  /**
   * @important
   * @default true
   */
  optionText?: boolean;
}

const ICON_LABEL = {
  light: { icon: <Sun />, label: "Light" },
  dark: { icon: <Moon />, label: "Dark" },
  system: { icon: <Monitor />, label: "System" },
};

export function ColorSchemeToggle({ triggerText = false, optionText = true }: ColorSchemeToggleProps) {
  const { configScheme, resolvedScheme, setColorScheme } = useColorScheme();
  const { icon, label } = ICON_LABEL[resolvedScheme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle color scheme">
          {icon}
          {triggerText && label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => setColorScheme("light")}
          className={style.option}
          data-selected={configScheme === "light"}
        >
          {ICON_LABEL.light.icon}
          {optionText && ICON_LABEL.light.label}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setColorScheme("dark")}
          className={style.option}
          data-selected={configScheme === "dark"}
        >
          {ICON_LABEL.dark.icon}
          {optionText && ICON_LABEL.dark.label}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setColorScheme("system")}
          className={style.option}
          data-selected={configScheme === "system"}
        >
          {ICON_LABEL.system.icon}
          {optionText && ICON_LABEL.system.label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
