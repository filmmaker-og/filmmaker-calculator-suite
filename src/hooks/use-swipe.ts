import { useRef, useCallback } from "react";

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  preventDefaultOnSwipe?: boolean;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventDefaultOnSwipe = false,
}: UseSwipeOptions): SwipeHandlers {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    touchCurrentX.current = e.touches[0].clientX;
    
    // Calculate horizontal and vertical distance
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
    
    // Only prevent default if horizontal swipe is dominant (prevents scroll blocking)
    if (preventDefaultOnSwipe && deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  }, [preventDefaultOnSwipe]);

  const onTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchCurrentX.current === null) {
      return;
    }

    const deltaX = touchCurrentX.current - touchStartX.current;
    const absDeltaX = Math.abs(deltaX);

    if (absDeltaX >= threshold) {
      if (deltaX < 0 && onSwipeLeft) {
        // Swiped left (go to next)
        onSwipeLeft();
      } else if (deltaX > 0 && onSwipeRight) {
        // Swiped right (go to previous)
        onSwipeRight();
      }
    }

    // Reset
    touchStartX.current = null;
    touchStartY.current = null;
    touchCurrentX.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
