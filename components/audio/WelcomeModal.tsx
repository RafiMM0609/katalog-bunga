'use client';

import { useEffect, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function WelcomeModal() {
  const { hasMadeChoice, setUserChoice } = useAudio();
  const [visible, setVisible] = useState(false);

  // Delay mount for 800ms so page loads first, then show modal
  useEffect(() => {
    if (!hasMadeChoice) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [hasMadeChoice]);

  if (hasMadeChoice || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Card */}
      <div className="relative z-10 bg-[#FFF0F5] rounded-2xl shadow-2xl px-8 py-10 max-w-sm w-full text-center animate-modal-in">
        {/* Icon */}
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center shadow-inner">
          <Music size={30} className="text-pink-500" />
        </div>

        <h2
          id="welcome-modal-title"
          className="playfair text-2xl font-bold text-pink-900 mb-2"
        >
          Selamat Datang di Kagitacraft
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Ingin menjelajah koleksi bunga kami dengan musik latar yang menenangkan?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setUserChoice('play')}
            className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-md"
            aria-label="Putar musik latar"
          >
            <Music size={16} />
            Ya, Putar Musik
          </button>
          <button
            onClick={() => setUserChoice('mute')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-500 font-medium px-6 py-3 rounded-xl border border-gray-200 transition-colors"
            aria-label="Lewati, jelajah tanpa musik"
          >
            <VolumeX size={16} />
            Lewati
          </button>
        </div>
      </div>
    </div>
  );
}
