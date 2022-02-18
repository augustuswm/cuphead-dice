import { useAudioClip } from "./hooks";

export function useSelectSettingClip() {
  return useAudioClip('/sfx/Menu_Move.mp3')
}

export function useSelectBossClip() {
  return useAudioClip('/sfx/Menu_Cardflip.mp3');
}