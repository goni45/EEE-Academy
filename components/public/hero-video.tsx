"use client";

import { useEffect, useRef, useState } from "react";

const HLS_URL =
  process.env.NEXT_PUBLIC_HERO_HLS_URL ??
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

function shouldPreferPoster() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 768px)").matches
  );
}

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [preferPoster] = useState(shouldPreferPoster);

  useEffect(() => {
    if (preferPoster) return;
    const video = videoRef.current;
    if (!video) return;
    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    const setup = async () => {
      try {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = HLS_URL;
          await video.play().catch(() => undefined);
          return;
        }
        const { default: Hls } = await import("hls.js");
        if (!Hls.isSupported()) {
          if (!cancelled) setFailed(true);
          return;
        }
        const instance = new Hls();
        hls = instance;
        instance.loadSource(HLS_URL);
        instance.attachMedia(video);
        instance.on(Hls.Events.ERROR, () => {
          if (!cancelled) setFailed(true);
        });
        await video.play().catch(() => undefined);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    void setup();
    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [preferPoster]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {!failed && !preferPoster ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,#1a2a3d,transparent_45%),radial-gradient(circle_at_80%_80%,#132033,transparent_40%),hsl(var(--bg))]" />
      )}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
