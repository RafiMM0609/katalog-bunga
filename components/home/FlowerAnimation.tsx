"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const REAL_FRAMES = [
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_001.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_002.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_003.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_004.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_005.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_006.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_007.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_008.jpg",
];

// Last 3 frames: flower bursts beyond the static circle ring.
type BurstConfig = { scale: number; rotation: number; glowOpacity: number };
const BURST_CONFIGS: BurstConfig[] = [
  { scale: 1.20, rotation: 1.5, glowOpacity: 0.50 },
  { scale: 1.38, rotation: 2.5, glowOpacity: 0.70 },
  { scale: 1.50, rotation: 3.5, glowOpacity: 0.90 },
];

const N_REAL = REAL_FRAMES.length;
const TOTAL_FRAMES = N_REAL + BURST_CONFIGS.length;
// Slightly longer than the original 180 ms so burst frames feel deliberate
const FRAME_DURATION = 200; // ms per frame

export default function FlowerAnimation() {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);

  const startAnimation = () => {
    if (intervalRef.current) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setFrame((prev) => (prev + 1) % TOTAL_FRAMES);
    }, FRAME_DURATION);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setFrame(TOTAL_FRAMES - 1); // hold on last burst frame while hovering
  };

  const restartAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setFrame(0);
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setFrame((prev) => (prev + 1) % TOTAL_FRAMES);
    }, FRAME_DURATION);
  };

  // Auto-play on mount, loop continuously
  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBurst = frame >= N_REAL;
  const burstConfig = isBurst ? BURST_CONFIGS[frame - N_REAL] : null;
  const displaySrc = isBurst ? REAL_FRAMES[N_REAL - 1] : REAL_FRAMES[frame];
  const imgScale = burstConfig?.scale ?? 1;
  const imgRotation = burstConfig?.rotation ?? 0;
  const glowOpacity = burstConfig?.glowOpacity ?? 0;

  // Outer layout container – maximised to give room for burst overflow, no visible border
  return (
    <div
      className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center cursor-pointer select-none"
      onMouseEnter={() => {
        isHoveringRef.current = true;
        stopAnimation();
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false;
        startAnimation();
      }}
      onClick={() => {
        // Only restart if not currently hovering (which would re-stop it immediately)
        if (!isHoveringRef.current) {
          restartAnimation();
        }
      }}
      title="Klik untuk memutar ulang animasi"
    >
      {/* Static circle – fixed size, never changes regardless of animation frame */}
      <div className="relative w-40 h-40 md:w-52 md:h-52 shrink-0">
        {/* Ring rendered behind the image so petals burst over it in the last 3 frames */}
        <div
          className="absolute inset-0 rounded-full ring-4 ring-pink-200 ring-offset-2 pointer-events-none"
          style={
            glowOpacity > 0
              ? {
                  boxShadow: `0 0 ${Math.round(32 * glowOpacity)}px ${Math.round(12 * glowOpacity)}px rgba(244,114,182,${glowOpacity})`,
                }
              : undefined
          }
        />

        {/* Flower image – scaled beyond the static ring during the last 3 burst frames */}
        <Image
          src={displaySrc}
          alt={`Bunga mekar - frame ${frame + 1}`}
          width={220}
          height={220}
          className="relative z-10 rounded-full object-cover w-full h-full"
          style={{
            boxShadow:
              glowOpacity > 0
                ? `0 0 ${Math.round(20 * glowOpacity)}px ${Math.round(8 * glowOpacity)}px rgba(244,114,182,${glowOpacity * 0.7}), 0 8px 20px rgba(0,0,0,0.15)`
                : "0 8px 20px rgba(0,0,0,0.15)",
            transform: `scale(${imgScale}) rotate(${imgRotation}deg)`,
            transition: `transform ${FRAME_DURATION - 20}ms ease-out, box-shadow ${FRAME_DURATION - 20}ms ease-out`,
          }}
          priority
        />
      </div>

      <span className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-pink-600 font-medium shadow pointer-events-none z-20">
        {isPlaying ? "🌸 Mekar..." : "🌺 Klik untuk putar ulang"}
      </span>
    </div>
  );
}
