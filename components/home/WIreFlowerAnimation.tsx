"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const REAL_FRAMES = [
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_001.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_002.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_003.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_004.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_005.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_006.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_007.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_008.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_009.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_010.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_011.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_012.jpg",
  "/hero-animate-wire-flower/Ubah_Background_Video_Pink_Soft_013.jpg",
];

// Virtual "burst-out" frames shown after full bloom.
// The same fully-bloomed image is scaled beyond the circular ring,
// making the petals appear to burst dramatically out of the frame.
type BurstConfig = { scale: number; rotation: number; glowOpacity: number };
const BURST_CONFIGS: BurstConfig[] = [
  { scale: 1.07, rotation: 0.0, glowOpacity: 0.30 },
  { scale: 1.16, rotation: 1.5, glowOpacity: 0.50 },
  { scale: 1.27, rotation: 2.5, glowOpacity: 0.65 },
  { scale: 1.35, rotation: 3.0, glowOpacity: 0.78 },
  { scale: 1.28, rotation: 2.0, glowOpacity: 0.62 },
  { scale: 1.16, rotation: 1.0, glowOpacity: 0.42 },
  { scale: 1.05, rotation: 0.0, glowOpacity: 0.22 },
];

const N_REAL = REAL_FRAMES.length;
// const TOTAL_FRAMES = N_REAL + BURST_CONFIGS.length;
const TOTAL_FRAMES = N_REAL;
// Slightly longer than the original 180 ms so burst frames feel deliberate
const FRAME_DURATION = 200; // ms per frame

export default function WireFlowerAnimation() {
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

  return (
    <div
      className="relative cursor-pointer select-none"
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
      {/* Fixed-size wrapper – defines the ring position and never changes size */}
      <div className="relative w-40 h-40 md:w-52 md:h-52">
        {/* Ring border rendered behind the image so petals burst over it */}
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

        {/* Flower image – scaled up during burst frames so it overflows the ring */}
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
            objectPosition: "50% 45%",
          }}
          priority
        />
      </div>
    </div>
  );
}
