import { useCallback, useEffect, useRef } from "react";

/**
 * Mobile Keyboard Scroll Hook
 * 
 * Handles the classic mobile input bug where the virtual keyboard
 * covers the focused input field. Uses scrollIntoView with a delay
 * to ensure the keyboard has finished animating.
 * 
 * Features:
 * - Scrolls focused input into view on mobile
 * - Debounced to avoid jitter during keyboard animation
 * - Uses visualViewport API when available for accurate positioning
 * - Falls back gracefully on unsupported browsers
 */

/** Detect if we're on a mobile device */
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
         ('ontouchstart' in window && window.innerWidth < 768);
};

/**
 * Hook to scroll an input element into view when focused on mobile.
 * Returns a ref to attach to the input element.
 */
export const useMobileKeyboardScroll = <T extends HTMLElement>() => {
  const elementRef = useRef<T>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollIntoViewSafely = useCallback(() => {
    if (!elementRef.current || !isMobile()) return;

    // Clear any pending scroll
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Delay scroll to let keyboard animation complete
    // iOS keyboard animation is ~300ms, Android varies
    timeoutRef.current = setTimeout(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      
      // Use scrollIntoView with smooth behavior
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });

      // Fallback: if visualViewport is available, adjust for keyboard
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const elementRect = element.getBoundingClientRect();
        const elementBottom = elementRect.bottom;
        
        // If element is below visible viewport, scroll more
        if (elementBottom > viewportHeight - 20) {
          const scrollAmount = elementBottom - viewportHeight + 100;
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth',
          });
        }
      }
    }, 350);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ref: elementRef,
    scrollIntoView: scrollIntoViewSafely,
  };
};

/**
 * Hook to handle visualViewport resize events.
 * Useful for adjusting layout when keyboard appears/disappears.
 */
export const useVisualViewport = (onResize?: (height: number) => void) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const viewport = window.visualViewport;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      // Debounce to avoid jitter
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onResize?.(viewport.height);
      }, 100);
    };

    viewport.addEventListener('resize', handleResize);
    
    return () => {
      viewport.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onResize]);
};

export default useMobileKeyboardScroll;
