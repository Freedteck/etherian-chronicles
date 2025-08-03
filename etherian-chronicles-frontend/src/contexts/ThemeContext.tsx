import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark"; // Only dark mode supported now

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme] = useState<Theme>("dark"); // Always dark

  useEffect(() => {
    const root = document.documentElement;

    // Always apply dark mode
    root.classList.remove("light");
    root.classList.add("dark");

    // Clear any old theme preferences that might interfere
    localStorage.removeItem("theme");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
