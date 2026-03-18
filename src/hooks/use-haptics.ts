import { useCallback, useRef } from "react";

/**
 * Premium Haptic Feedback Hook
 *
 * Android: Uses the Vibration API for real tactile feedback.
 * iOS / unsupported: Falls back to a micro-scale + opacity pulse
 * on the event target, giving a visual "press" feel.
 *
 * Usage:
 *   haptics.light()            — fire-and-forget (vibration only)
 *   haptics.light(e)           — vibration + visual pulse on e.currentTarget
 *   haptics.medium(e)          — stronger vibration + visual pulse
 */

const HAS_VIBRATE = typeof navigator !== "undefined" && "vibrate" in navigator;

// CSS class for the visual pulse — injected once
const PULSE_CLASS = "haptic-pulse";
const PULSE_HEAVY_CLASS = "haptic-pulse-heavy";
const PULSE_SUCCESS_CLASS = "haptic-pulse-success";

let styleInjected = false;
const injectStyles = () => {
  if (styleInjected || typeof document === "undefined") return;
  styleInjected = true;
  const style = document.createElement("style");
  style.id = "haptic-pulse-styles";
  style.textContent = `
    @keyframes hapticPulse {
      0%   { transform: scale(1);    opacity: 1; }
      40%  { transform: scale(0.97); opacity: 0.85; }
      100% { transform: scale(1);    opacity: 1; }
    }
    @keyframes hapticPulseHeavy {
      0%   { transform: scale(1);    opacity: 1; }
      35%  { transform: scale(0.95); opacity: 0.80; }
      100% { transform: scale(1);    opacity: 1; }
    }
    @keyframes hapticPulseSuccess {
      0%   { transform: scale(1);    opacity: 1; }
      25%  { transform: scale(0.97); opacity: 0.85; }
      50%  { transform: scale(1.01); opacity: 1; }
      75%  { transform: scale(0.99); opacity: 0.95; }
      100% { transform: scale(1);    opacity: 1; }
    }
    .${PULSE_CLASS} {
      animation: hapticPulse 150ms ease-out !important;
    }
    .${PULSE_HEAVY_CLASS} {
      animation: hapticPulseHeavy 200ms ease-out !important;
    }
    .${PULSE_SUCCESS_CLASS} {
      animation: hapticPulseSuccess 300ms ease-out !important;
    }
  `;
  document.head.appendChild(style);
};

type HapticEvent =
  | React.MouseEvent
  | React.TouchEvent
  | React.PointerEvent
  | { currentTarget: HTMLElement | null }
  | undefined;

const applyVisualPulse = (e: HapticEvent, className: string) => {
  if (!e) return;
  const el = (e as { currentTarget: HTMLElement | null }).currentTarget;
  if (!el || !(el instanceof HTMLElement)) return;

  // Remove any existing pulse first so re-triggers work
  el.classList.remove(PULSE_CLASS, PULSE_HEAVY_CLASS, PULSE_SUCCESS_CLASS);
  // Force reflow to restart animation
  void el.offsetWidth;
  el.classList.add(className);

  const cleanup = () => {
    el.classList.remove(className);
    el.removeEventListener("animationend", cleanup);
  };
  el.addEventListener("animationend", cleanup);
};

export const useHaptics = () => {
  const initialized = useRef(false);

  if (!initialized.current) {
    injectStyles();
    initialized.current = true;
  }

  const vibrate = useCallback((pattern: number | number[]) => {
    if (HAS_VIBRATE) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Silently fail on devices that don't support vibration
      }
    }
  }, []);

  return {
    /** Quick tap - for toggles, pills, minor interactions (10ms) */
    light: useCallback((e?: HapticEvent) => {
      vibrate(10);
      if (!HAS_VIBRATE || e) applyVisualPulse(e, PULSE_CLASS);
    }, [vibrate]),

    /** Button press - standard button feedback (25ms) */
    medium: useCallback((e?: HapticEvent) => {
      vibrate(25);
      if (!HAS_VIBRATE || e) applyVisualPulse(e, PULSE_CLASS);
    }, [vibrate]),

    /** Important action - for significant UI changes (50ms) */
    heavy: useCallback((e?: HapticEvent) => {
      vibrate(50);
      if (!HAS_VIBRATE || e) applyVisualPulse(e, PULSE_HEAVY_CLASS);
    }, [vibrate]),

    /** Success pattern - for successful form submissions */
    success: useCallback((e?: HapticEvent) => {
      vibrate([30, 50, 30]);
      if (!HAS_VIBRATE || e) applyVisualPulse(e, PULSE_SUCCESS_CLASS);
    }, [vibrate]),

    /** Error pattern - for form errors or failed actions */
    error: useCallback((e?: HapticEvent) => {
      vibrate([50, 30, 50, 30, 50]);
      if (!HAS_VIBRATE || e) applyVisualPulse(e, PULSE_HEAVY_CLASS);
    }, [vibrate]),

    /** Step change - for navigation between wizard steps */
    step: useCallback((e?: HapticEvent) => {
      vibrate(35);
      if (!HAS_VIBRATE || e) applyVisualPulse(e, PULSE_CLASS);
    }, [vibrate]),
  };
};

export default useHaptics;
