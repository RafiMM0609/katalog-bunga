"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FRAMES = [
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_001.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_002.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_003.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_004.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_005.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_006.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_007.jpg",
  "/hero-animate-flower/Animasi_Bunga_Mekar_Dari_Daun_008.jpg",
];

const FRAME_DURATION = 180; // ms per frame

export default function FlowerAnimation() {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnimation = () => {
    if (intervalRef.current) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAMES.length);
    }, FRAME_DURATION);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setFrame(FRAMES.length - 1); // hold on last (fully bloomed) frame on hover-stop
  };

  // Auto-play on mount, loop continuously
  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative cursor-pointer select-none"
      onMouseEnter={stopAnimation}
      onMouseLeave={startAnimation}
      onClick={() => {
        if (!isPlaying) {
          setFrame(0);
          startAnimation();
        }
      }}
      title="Klik untuk memutar ulang animasi"
    >
      <Image
        src={FRAMES[frame]}
        alt={`Bunga mekar - frame ${frame + 1}`}
        width={220}
        height={220}
        className="rounded-full shadow-lg object-cover w-40 h-40 md:w-52 md:h-52 ring-4 ring-pink-200 ring-offset-2"
        priority
      />
      <span className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-pink-600 font-medium shadow pointer-events-none">
        {isPlaying ? "🌸 Mekar..." : "🌺 Hover untuk pause"}
      </span>
    </div>
  );
}
