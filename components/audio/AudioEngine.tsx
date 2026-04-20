'use client';

import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

const FADE_STEP = 0.05;
const FADE_INTERVAL_MS = 80;
const TARGET_VOLUME = 0.4;

export default function AudioEngine() {
  const { isPlaying } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearFade = () => {
    if (fadeTimerRef.current !== null) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const fadeIn = (audio: HTMLAudioElement) => {
    clearFade();
    audio.volume = 0;
    audio.play().catch(() => {
      // Autoplay blocked — user interaction will re-trigger
    });
    fadeTimerRef.current = setInterval(() => {
      if (audio.volume < TARGET_VOLUME - FADE_STEP) {
        audio.volume = Math.min(audio.volume + FADE_STEP, TARGET_VOLUME);
      } else {
        audio.volume = TARGET_VOLUME;
        clearFade();
      }
    }, FADE_INTERVAL_MS);
  };

  const fadeOut = (audio: HTMLAudioElement) => {
    clearFade();
    fadeTimerRef.current = setInterval(() => {
      if (audio.volume > FADE_STEP) {
        audio.volume = Math.max(audio.volume - FADE_STEP, 0);
      } else {
        audio.volume = 0;
        audio.pause();
        clearFade();
      }
    }, FADE_INTERVAL_MS);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      fadeIn(audio);
    } else {
      fadeOut(audio);
    }

    return clearFade;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      style={{ display: 'none' }}
      aria-hidden="true"
    >
      <source src="/audio/backsound-kagita.mp3" type="audio/mpeg" />
      <source src="/audio/background.ogg" type="audio/ogg" />
    </audio>
  );
}
