import { useEffect, useState } from "react";

type ColorScheme = "light" | "dark" | "system";
type ResolvedScheme = "light" | "dark";

// Only an explicit choice from the theme toggle is stored. A new key, because the
// old "color-scheme" key was written on every visit and holds an unchosen "dark".
// index.html reads the same key before first paint to avoid a flash.
const STORAGE_KEY = "terminal-theme";

export function useColorScheme() {
  const [configScheme, setConfigScheme] = useState<ColorScheme>(() => {
    // Light is the default look; only an explicit toggle choice overrides it.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // storage blocked — use the default
    }
    return "light";
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
  }, [resolvedScheme]);

  const setColorScheme = (scheme: ColorScheme) => {
    setConfigScheme(scheme);
    try {
      localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // storage blocked — the choice lasts for this visit only
    }
  };

  return { configScheme, resolvedScheme, setColorScheme };
}
