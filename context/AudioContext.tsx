'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'kgc_music_pref';

type MusicPref = 'play' | 'mute';

interface AudioContextValue {
  isPlaying: boolean;
  hasMadeChoice: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setUserChoice: (choice: MusicPref) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasMadeChoice, setHasMadeChoice] = useState(false);

  // Read localStorage on mount (client-only)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as MusicPref | null;
    if (saved === 'play') {
      setIsPlaying(true);
      setHasMadeChoice(true);
    } else if (saved === 'mute') {
      setIsPlaying(false);
      setHasMadeChoice(true);
    }
    // If null → modal will be shown (hasMadeChoice remains false)
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? 'play' : 'mute');
      return next;
    });
  }, []);

  const setUserChoice = useCallback((choice: MusicPref) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setHasMadeChoice(true);
    setIsPlaying(choice === 'play');
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, hasMadeChoice, play, pause, toggle, setUserChoice }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider');
  return ctx;
}
