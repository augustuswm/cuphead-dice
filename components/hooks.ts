import { useRef } from "react";
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

export function useAudio() {
  // @ts-ignore
  let inner = useRef<HTMLAudioElement>(typeof document !== 'undefined' ? document.createElement('audio') : {});
  return inner.current;
}

export function useAudioClip(clip: string) {
  let audio = useAudio();

  if (!audio.src) {
    audio.src = clip;
  }

  return audio;
}