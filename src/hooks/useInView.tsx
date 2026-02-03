import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          // we only need the entrance once — stop observing to keep work minimal
          obs.unobserve(entry.target);
        }
      });
    }, options ?? { threshold: 0.12 });

    observer.observe(el);

    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}