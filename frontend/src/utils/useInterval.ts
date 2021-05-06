/**
 * @module useInterval
 * @category Utils
 */
import * as React from "react";
const { useEffect, useRef } = React;

type IntervalFunction = () => unknown | void;

/**
 * Custom react hook for setting an interval.
 * @param {IntervalFunction} callback Function to be performed in interval.
 * @param {number | null} delay Time to be inactive, duration of interval iteration.
 */
function useInterval(callback: IntervalFunction, delay: number | null) {
  const savedCallback = useRef<IntervalFunction | null>(null);

  useEffect(() => {
    if (delay === null) return;
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay === null) return;
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
export default useInterval;
