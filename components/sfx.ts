import { INTROS } from "../data/intros";
import { useAudio, useAudioClip } from "./hooks";

export function useSelectSettingClip(persistAcrossPageTransitions = false) {
  return useAudioClip('/sfx/Menu_Move.mp3', persistAcrossPageTransitions)
}

export function useSelectBossClip(persistAcrossPageTransitions = false) {
  return useAudioClip('/sfx/Menu_Cardflip.mp3', persistAcrossPageTransitions);
}

export function useKnockoutClip(persistAcrossPageTransitions = false) {
  return useAudioClip('/sfx/Knockout!.mp3', persistAcrossPageTransitions);
}

export function useBoomClip(persistAcrossPageTransitions = false) {
  return useAudioClip('/sfx/boom.mp3', persistAcrossPageTransitions);
}

export function useBellClip(persistAcrossPageTransitions = false) {
  return useAudioClip('/sfx/bell_3.mp3', persistAcrossPageTransitions);
}

export function useVinylClip(persistAcrossPageTransitions = false) {
  return useAudioClip('/sfx/vinyl2.mp3', persistAcrossPageTransitions);
}

export function useBuzzerClip(persistAcrossPageTransitions = false) {
  return useAudioClip('/sfx/buzzer.mp3', persistAcrossPageTransitions);
}

let introPos = 0;

function getIntroToPlay(): string {
  let intro = INTROS[introPos];
  introPos++;

  if (!INTROS[introPos]) {
    introPos = 0;
  }

  return `/sfx/${intro}.mp3`;
}

export function useIntroClip() {
  let audio = useAudio();

  return {
    ...audio,
    play: () => {
      audio.src = getIntroToPlay();
      audio.currentTime = 0;
      audio.play()
    }
  };
}