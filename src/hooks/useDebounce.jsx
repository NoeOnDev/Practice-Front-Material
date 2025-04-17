import { useCallback, useRef } from "react";

export const useDebounce = (fn, delay) => {
  const timeoutId = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
};
