import { useAudioClip } from "./hooks";

export function useSelectSettingClip() {
  return useAudioClip('/sfx/Menu_Move.mp3')
}

export function useSelectBossClip() {
  return useAudioClip('/sfx/Menu_Cardflip.mp3');
}

export function useKnockoutClip() {
  return useAudioClip('/sfx/Knockout!.mp3');
}

export function useBoomClip() {
  return useAudioClip('/sfx/boom.mp3');
}

export function useBellClip() {
  return useAudioClip('/sfx/bell_3.mp3');
}

export function useVinylClip() {
  return useAudioClip('/sfx/vinyl2.mp3');
}

export function useBuzzerClip() {
  return useAudioClip('/sfx/buzzer.mp3');
}