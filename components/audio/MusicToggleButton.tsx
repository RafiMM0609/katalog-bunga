'use client';

import { useAudio } from '@/context/AudioContext';
import { VolumeX } from 'lucide-react';

export default function MusicToggleButton() {
  const { isPlaying, toggle } = useAudio();

  return (
    <button
      onClick={toggle}
      title={isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}
      aria-label={isPlaying ? 'Matikan musik latar' : 'Nyalakan musik latar'}
      aria-pressed={isPlaying}
      className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-pink-600 transition-colors"
    >
      {isPlaying ? (
        /* Equalizer animation: 3 bars */
        <span className="flex items-end gap-[3px] h-[18px]" aria-hidden="true">
          <span className="eq-bar eq-bar-1" />
          <span className="eq-bar eq-bar-2" />
          <span className="eq-bar eq-bar-3" />
        </span>
      ) : (
        <VolumeX size={20} aria-hidden="true" />
      )}
    </button>
  );
}
