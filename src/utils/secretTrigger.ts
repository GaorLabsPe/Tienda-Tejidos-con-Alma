import React, { useRef, useCallback } from 'react';

/**
 * Creates a robust 3-click trigger for opening the Admin modal.
 * Uses a rolling window so 3 clicks within 2.5 seconds triggers the action reliably on any device (desktop & mobile).
 */
export function useSecretAdminTrigger(onTrigger: () => void) {
  const countRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }

    countRef.current += 1;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (countRef.current >= 3) {
      countRef.current = 0;
      onTrigger();
      return;
    }

    // Reset count if no next click happens within 2.5 seconds
    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, 2500);
  }, [onTrigger]);

  return handleClick;
}
