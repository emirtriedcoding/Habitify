"use client";

import Loader from "@/components/global/Loader";

import { useEffect, useState, createContext } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "cupcake";
    setTheme(theme);
  }, []);

  const changeTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  if (!theme) return <Loader />;

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <div className="relative min-h-screen" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
