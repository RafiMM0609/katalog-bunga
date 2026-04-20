'use client';

import { AudioProvider } from '@/context/AudioContext';
import AudioEngine from '@/components/audio/AudioEngine';
import WelcomeModal from '@/components/audio/WelcomeModal';

export default function AudioClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      {children}
      <AudioEngine />
      <WelcomeModal />
    </AudioProvider>
  );
}
