"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const STEMMED_FLOWER_FRAMES = [
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_001.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_002.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_003.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_004.jpg",
];

const FLOWER_BG_CONFIG = {
  scrollRange: 400,
  bottom: "-40px",
  right: "-20px",
  width: 220,
  height: 220,
  opacity: 0.18,
  rotation: -10,
};

export default function BackgroundFlowerAnimation() {
  const [flowerFrame, setFlowerFrame] = useState(0);
  const rafId = useRef<number | null>(null);

  // Preload images into browser cache
  useEffect(() => {
    STEMMED_FLOWER_FRAMES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / FLOWER_BG_CONFIG.scrollRange, 1);
        const frame = Math.round(progress * (STEMMED_FLOWER_FRAMES.length - 1));
        setFlowerFrame((prev) => (prev !== frame ? frame : prev));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none select-none"
      style={{
        bottom: FLOWER_BG_CONFIG.bottom,
        right: FLOWER_BG_CONFIG.right,
        width: FLOWER_BG_CONFIG.width,
        height: FLOWER_BG_CONFIG.height,
        opacity: FLOWER_BG_CONFIG.opacity,
        transform: `rotate(${FLOWER_BG_CONFIG.rotation}deg)`,
        transition: "opacity 0.2s ease",
        zIndex: 0,
      }}
    >
      <Image
        src={STEMMED_FLOWER_FRAMES[flowerFrame]}
        alt=""
        width={FLOWER_BG_CONFIG.width}
        height={FLOWER_BG_CONFIG.height}
        className="object-cover rounded-full w-full h-full"
        draggable={false}
        priority={false}
      />
    </div>
  );
}
