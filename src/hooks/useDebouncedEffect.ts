import { useEffect, useState } from "react";

/**
 *
 * @param timeout timeout
 * @param setup a callback function that needn't clean up
 * @param dependecies the dependencies list
 */
export const useDebouncedEffect = (
  timeout: number,
  setup: React.EffectCallback,
  dependecies: React.DependencyList | undefined,
) => {
  const [shouldDefer, setShouldDefer] = useState(false);

  useEffect(() => {
    /* the action should defer */
    if (shouldDefer) {
      const timer = setTimeout(() => {
        setup();
        setShouldDefer(false);
      }, timeout);

      return () => {
        clearTimeout(timer);
      };
    }

    /* the action do immediately */
    setup();
    setShouldDefer(true);

    const timer = setTimeout(() => {
      setShouldDefer(false);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, dependecies);
};
