import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { DifficultyLevel } from "../data/difficulty";

export function useDifficultyTime(level: DifficultyLevel): number {
  switch (level) {
    case DifficultyLevel.TEN:
      return 10;
    case DifficultyLevel.FIFTEEN:
      return 15;
    case DifficultyLevel.TWENTY:
      return 20;
  }
}

export type Audio = {
  play: () => void
  pause: () => void
  onended: ((this: GlobalEventHandlers, ev: Event) => any) | null
  src?: string
  currentTime: number
  playbackRate: number
  volume: number
  duration: number
}

const MOCK_AUDIO = {
  play: () => { },
  pause: () => { },
  onended: null,
  currentTime: 0,
  playbackRate: 0,
  volume: 0,
  duration: 0
}

export function useAudio(persistAcrossPageTransitions = false) {
  let router = useRouter();
  let inner = useRef<Audio>(typeof document !== 'undefined' ? document.createElement('audio') : MOCK_AUDIO);

  useEffect(() => {
    if (!persistAcrossPageTransitions) {
      let cancelMusic = () => inner.current.pause();
      router.events.on('routeChangeStart', cancelMusic);
      return () => router.events.off('routeChangeStart', cancelMusic);
    }
  }, [inner.current, persistAcrossPageTransitions]);

  return inner.current;
}

export function useAudioClip(clip: string, persistAcrossPageTransitions = false) {
  let audio = useAudio(persistAcrossPageTransitions);

  if (!audio.src) {
    audio.src = clip;
  }

  return audio;
}