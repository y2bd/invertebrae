import React, { useState, useEffect, useRef } from "react";

type IntervalCallback = (stop: () => void) => void;

export default function useInterval(callback: IntervalCallback, delay: number) {
  const savedCallback = useRef<IntervalCallback>();
  const savedId = useRef<NodeJS.Timeout>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current && savedId.current) {
        savedCallback.current(() => clearInterval(savedId.current!));
      }
    }

    if (delay !== null) {
      savedId.current = setInterval(tick, delay);
      return () => clearInterval(savedId.current!);
    }
  }, [delay]);
}
