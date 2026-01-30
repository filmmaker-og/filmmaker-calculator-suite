import { useCallback } from "react";

/**
 * Premium Haptic Feedback Hook
 * Provides tactile feedback for interactive elements using the Vibration API.
 * Gracefully degrades on devices without vibration support.
 */
export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Silently fail on devices that don't support vibration
      }
    }
  }, []);

  return {
    /** Quick tap - for toggles and minor interactions (10ms) */
    light: useCallback(() => vibrate(10), [vibrate]),
    
    /** Button press - standard button feedback (25ms) */
    medium: useCallback(() => vibrate(25), [vibrate]),
    
    /** Important action - for significant UI changes (50ms) */
    heavy: useCallback(() => vibrate(50), [vibrate]),
    
    /** Success pattern - for successful form submissions */
    success: useCallback(() => vibrate([30, 50, 30]), [vibrate]),
    
    /** Error pattern - for form errors or failed actions */
    error: useCallback(() => vibrate([50, 30, 50, 30, 50]), [vibrate]),
    
    /** Step change - for navigation between wizard steps */
    step: useCallback(() => vibrate(35), [vibrate]),
  };
};

export default useHaptics;
