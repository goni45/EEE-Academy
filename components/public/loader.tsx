"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["Learn", "Prepare", "Achieve"];

function hasSeenLoader() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("eee-loader-shown") === "1";
}

export function Loader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(() => !hasSeenLoader());
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      sessionStorage.setItem("eee-loader-shown", "1");
      const timeout = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(timeout);
    }

    let frame = 0;
    const start = performance.now();
    const duration = 2700;

    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - start) / duration) * 100));
      setProgress(next);
      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          sessionStorage.setItem("eee-loader-shown", "1");
          setVisible(false);
        }, 400);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, visible]);

  useEffect(() => {
    if (!visible || reduced) return;
    const id = window.setInterval(() => {
      setWordIndex((index) => (index + 1) % words.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [visible, reduced]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[9999] bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden={!visible}
        >
          <p className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted">
            EEE ACADEMY
          </p>
          <div className="flex h-full items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={words[wordIndex]}
                className="font-display italic text-4xl md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {words[wordIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="absolute bottom-16 right-6 font-display tabular-nums text-6xl md:text-8xl lg:text-9xl">
            {String(progress).padStart(3, "0")}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
            <div
              className="h-full origin-left accent-gradient shadow-[0_0_18px_#4E85BF]"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
