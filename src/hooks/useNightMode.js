import { useState, useEffect, useRef } from 'react';
import { isAfterSunset } from '../utils/sunset';

export function useNightMode() {
  const [isNight, setIsNight] = useState(isAfterSunset);
  const manualRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (manualRef.current === null) setIsNight(isAfterSunset());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  function toggle() {
    setIsNight(prev => {
      const next = !prev;
      manualRef.current = next;
      return next;
    });
  }

  return { isNight, toggle };
}
