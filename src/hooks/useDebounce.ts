import { useLayoutEffect, useMemo, useRef } from "react";

function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  timeout = 300,
) {
  let timer: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

function useDebounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay = 300,
) {
  const callbackRef = useRef<(...args: T) => void>(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo<(...args: T) => void>(
    () => debounce<T>((...args: T) => callbackRef.current(...args), delay),
    [delay],
  );
}

export default useDebounce;
