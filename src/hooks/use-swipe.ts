import { useRef, useCallback, useState } from "react";

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

interface SwipeState {
  /** Current swipe offset in pixels (negative = left, positive = right) */
  offset: number;
  /** Whether a swipe gesture is currently in progress */
  isSwiping: boolean;
  /** Direction of the current swipe */
  direction: 'left' | 'right' | null;
}

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onProgress?: (offset: number, direction: 'left' | 'right' | null) => void;
  threshold?: number;
  preventDefaultOnSwipe?: boolean;
  /** Maximum offset before rubber-banding kicks in */
  maxOffset?: number;
  /** Enable rubber-band effect at boundaries */
  rubberBand?: boolean;
}

interface UseSwipeReturn {
  handlers: SwipeHandlers;
  state: SwipeState;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onProgress,
  threshold = 50,
  preventDefaultOnSwipe = false,
  maxOffset = 150,
  rubberBand = true,
}: UseSwipeOptions): UseSwipeReturn {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  
  const [state, setState] = useState<SwipeState>({
    offset: 0,
    isSwiping: false,
    direction: null,
  });

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    isHorizontalSwipe.current = null;
    setState({ offset: 0, isSwiping: true, direction: null });
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    touchCurrentX.current = currentX;
    
    // Calculate horizontal and vertical distance
    const deltaX = currentX - touchStartX.current;
    const deltaY = Math.abs(currentY - touchStartY.current);
    const absDeltaX = Math.abs(deltaX);
    
    // Determine if this is a horizontal swipe (only once per gesture)
    if (isHorizontalSwipe.current === null && (absDeltaX > 10 || deltaY > 10)) {
      isHorizontalSwipe.current = absDeltaX > deltaY;
    }
    
    // Only track horizontal swipes
    if (isHorizontalSwipe.current) {
      // Apply rubber-band effect if enabled
      let offset = deltaX;
      if (rubberBand && Math.abs(offset) > maxOffset) {
        const overflow = Math.abs(offset) - maxOffset;
        const dampened = maxOffset + (overflow * 0.3);
        offset = offset > 0 ? dampened : -dampened;
      }
      
      const direction: 'left' | 'right' | null = deltaX < -10 ? 'left' : deltaX > 10 ? 'right' : null;
      
      setState({
        offset,
        isSwiping: true,
        direction,
      });
      
      onProgress?.(offset, direction);
      
      // Prevent default to avoid scroll interference
      if (preventDefaultOnSwipe && absDeltaX > 10) {
        e.preventDefault();
      }
    }
  }, [preventDefaultOnSwipe, maxOffset, rubberBand, onProgress]);

  const onTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchCurrentX.current === null) {
      setState({ offset: 0, isSwiping: false, direction: null });
      return;
    }

    const deltaX = touchCurrentX.current - touchStartX.current;
    const absDeltaX = Math.abs(deltaX);

    if (absDeltaX >= threshold && isHorizontalSwipe.current) {
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
    isHorizontalSwipe.current = null;
    setState({ offset: 0, isSwiping: false, direction: null });
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    state,
  };
}
