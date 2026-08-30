import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const STORAGE_KEY = "fishert-studio-theme";
const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
});

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}