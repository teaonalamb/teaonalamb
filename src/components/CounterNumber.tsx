import React, { useEffect, useState } from 'react';

interface CounterNumberProps {
  value: string;
  numericTarget: number;
  durationMs?: number;
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  value,
  numericTarget,
  durationMs = 1200,
}) => {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * numericTarget);
      setDisplayNumber(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayNumber(numericTarget);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [numericTarget, durationMs]);

  // If the target has 'k', format appropriately when complete
  if (value.includes('k')) {
    if (displayNumber >= 1000) {
      return <span>{(displayNumber / 1000).toFixed(1)}k</span>;
    }
    return <span>{displayNumber}</span>;
  }

  return <span>{displayNumber}</span>;
};
