"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

const HLS_URL =
  process.env.NEXT_PUBLIC_HERO_HLS_URL ??
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: Hls | null = null;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsInstance = hls;

      hls.loadSource(HLS_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {/* Video Element from demo front */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-70"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
    </div>
  );
}

