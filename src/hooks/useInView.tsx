import { useEffect, useRef, useState, useMemo } from "react";

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOptions = useMemo(() => options ?? { threshold: 0.12 }, [JSON.stringify(options)]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(entry.target);
        }
      });
    }, stableOptions);

    observer.observe(el);

    return () => observer.disconnect();
  }, [stableOptions]);

  return { ref, inView };
}
