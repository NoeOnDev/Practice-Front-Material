import { useContext } from "react";
import { ColorSchemeContext } from "./ColorSchemeContext";

export const useColorSchemeShim = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error(
      "useColorSchemeShim must be used within a ColorSchemeProvider"
    );
  }
  return context;
};
