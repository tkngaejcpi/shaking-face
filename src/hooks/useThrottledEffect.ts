import { useEffect } from "react";

/**
 *
 * @param timeout timeout
 * @param setup a callback function that needn't clean up
 * @param dependecies the dependencies list
 */
export const useThrottledEffect = (
  timeout: number,
  setup: React.EffectCallback,
  dependecies: React.DependencyList | undefined,
) => {
  useEffect(() => {
    /* the action should defer */
    const timer = setTimeout(() => {
      setup();
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, dependecies);
};
