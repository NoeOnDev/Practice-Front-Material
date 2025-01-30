import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useMediaQuery, createTheme, ThemeProvider } from "@mui/material";
import { ColorSchemeContext } from "./ColorSchemeContext";

export const ColorSchemeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      systemMode: prefersDarkMode ? "dark" : "light",
    }),
    [mode, prefersDarkMode]
  );

  return (
    <ColorSchemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorSchemeContext.Provider>
  );
};

ColorSchemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
