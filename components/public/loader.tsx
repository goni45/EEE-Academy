"use client";

import { safeGetSession, safeSetSession } from "@/lib/safe-storage";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

const words = ["Learn", "Prepare", "Achieve"];

function isAlreadySeen() {
  return safeGetSession("eee-loader-shown") === "1";
}

export function Loader() {
  const reduced = useReducedMotion();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Initialize: False on SSR so it never blocks server render with a black screen
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !isAlreadySeen();
  });
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reduced && visible) {
      safeSetSession("eee-loader-shown", "1");
      const id = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(id);
    }

    if (!visible) return;

    let frame = 0;
    const start = performance.now();
    const duration = 1600; // Snappy 1.6s

    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - start) / duration) * 100));
      setProgress(next);
      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          safeSetSession("eee-loader-shown", "1");
          setVisible(false);
        }, 200);
      }
    };

    frame = requestAnimationFrame(tick);

    // Hard fallback failsafe: never let loader stay longer than 2.2s under any circumstances
    const failsafe = window.setTimeout(() => {
      safeSetSession("eee-loader-shown", "1");
      setVisible(false);
    }, 2200);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafe);
    };
  }, [reduced, visible]);

  useEffect(() => {
    if (!visible || reduced) return;
    const id = window.setInterval(() => {
      setWordIndex((index) => (index + 1) % words.length);
    }, 550);
    return () => window.clearInterval(id);
  }, [visible, reduced]);

  // If not in client or not visible, do not render overlay
  if (!isClient || !visible) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] cursor-pointer select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            safeSetSession("eee-loader-shown", "1");
            setVisible(false);
          }}
          title="Click to skip"
          role="status"
          aria-label="Loading EEE Academy"
        >
          <div className="absolute left-6 top-6 flex items-center gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">EEE ACADEMY</p>
          </div>

          <div className="absolute right-6 top-6 text-[11px] text-muted/60 tracking-wider">
            [Click to skip]
          </div>

          <div className="flex h-full items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={words[wordIndex]}
                className="font-display italic text-4xl text-text-primary md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {words[wordIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="absolute bottom-16 right-6 font-display tabular-nums text-6xl text-text-primary md:text-8xl lg:text-9xl">
            {String(progress).padStart(3, "0")}
          </p>

          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
            <div
              className="h-full origin-left accent-gradient shadow-[0_0_18px_#4E85BF] transition-all"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
