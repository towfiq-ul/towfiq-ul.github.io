import { useEffect, useState } from "react";

type ColorScheme = "light" | "dark" | "system";
type ResolvedScheme = "light" | "dark";

export function useColorScheme() {
  const [configScheme, setConfigScheme] = useState<ColorScheme>(() => {
    const stored = localStorage.getItem("color-scheme");
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
    return "system";
  });

  const [resolvedScheme, setResolvedScheme] = useState<ResolvedScheme>(() => {
    if (configScheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return configScheme;
  });

  useEffect(() => {
    if (configScheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedScheme(e.matches ? "dark" : "light");
      };
      
      setResolvedScheme(mediaQuery.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedScheme(configScheme);
    }
  }, [configScheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedScheme);
    root.style.colorScheme = resolvedScheme;
    localStorage.setItem("color-scheme", configScheme);
  }, [resolvedScheme, configScheme]);

  const setColorScheme = (scheme: ColorScheme) => {
    setConfigScheme(scheme);
  };

  return { configScheme, resolvedScheme, setColorScheme };
}
