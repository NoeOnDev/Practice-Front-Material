export const customScrollbarStyles = {
  "&::-webkit-scrollbar": {
    width: "6px",
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(0, 0, 0, 0.3)",
  },
  "[data-toolpad-color-scheme='dark'] &::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.2)",
  },
  "[data-toolpad-color-scheme='dark'] &::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255, 255, 255, 0.3)",
  },
};
