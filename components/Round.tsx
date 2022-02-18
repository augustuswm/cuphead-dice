import { useCallback, useRef, useState } from "react";
import { useRaf } from "react-use";
import { DifficultyLevel } from "../data/difficulty";
import { INTROS } from "../data/intros";
import { useAudio, useAudioClip, useDifficultyTime } from "./hooks";
import s from '../styles/Round.module.css';

let introPos = 0;

function getIntroToPlay(): string {
  let intro = INTROS[introPos];
  introPos++;

  if (!INTROS[introPos]) {
    introPos = 0;
  }

  return `/sfx/${intro}.mp3`;
}

function useBellClip() {
  return useAudioClip('/sfx/bell_3.mp3');
}

function useVinylClip() {
  return useAudioClip('/sfx/vinyl2.mp3');
}

function useBuzzerClip() {
  return useAudioClip('/sfx/buzzer.mp3');
}

enum RoundTimerState {
  Ready,
  Intro,
  Running,
  Ending,
}

function useRoundTimerAudio() {
  let intro = useAudio();
  let bell = useBellClip();
  let warning = useVinylClip();
  let buzzer = useBuzzerClip();

  return { intro, bell, warning, buzzer };
}

function getAudioVolumeRampIn(ramp: number) {
  return Math.min(1.0, 0.0001 * ramp + 0.6);
}

function getAudioVolumeRampOut(ramp: number) {
  return Math.min(1.0, 0.0001 * ramp + 0.75);
}

function getAudioVolumeEndingRampOut(ramp: number) {
  return Math.max(0.0, -0.000375 * ramp + 0.75);
}

function getAudioPlaybackRampOut(ramp: number) {
  return -0.000125 * ramp + 1.75;
}

function applyMusicMods(
  music: HTMLAudioElement,
  state: RoundTimerState,
  delta: number,
  elapsed: number,
  remaining: number
) {
  if (state === RoundTimerState.Running) {
    if (elapsed < 5000) {
      music.volume = getAudioVolumeRampIn(Math.max(0, elapsed));
    } else if (remaining < 3000) {
      music.volume = getAudioVolumeRampOut(Math.max(0, remaining));
    } else {
      music.volume = 1.0;
    }

    if (remaining > 0 && 6000 >= remaining) {
      // music.playbackRate = getAudioPlaybackRampOut(remaining);
      music.playbackRate = 1.25;
    } else {
      music.playbackRate = 1.0;
    }
  } else if (state === RoundTimerState.Ending) {
    music.volume = getAudioVolumeEndingRampOut(delta);
  }
}

function computeElapsed(state: RoundTimerState, delta: number, durationMs: number) {
  let elapsed = 0;

  if (state === RoundTimerState.Running) {
    elapsed = delta;
  } else if (state === RoundTimerState.Ending) {
    elapsed = durationMs;
  }

  return elapsed;
}

function computeRemaining(state: RoundTimerState, delta: number, durationMs: number) {
  let remaining = durationMs;

  if (state === RoundTimerState.Running) {
    remaining = durationMs - delta;
  } else if (state === RoundTimerState.Ending) {
    remaining = 0;
  }

  return remaining;
}

function useRoundTimer(durationMs: number, music: HTMLAudioElement) {
  let _ = useRaf(1e11, 0);

  let [state, setRoundState] = useState<RoundTimerState>(RoundTimerState.Ready);
  let [startTime, setStartTime] = useState(0);

  let [roundTimer, setRoundTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  let [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | undefined>(undefined);

  let { intro, bell, warning, buzzer } = useRoundTimerAudio();
  let introCompleteCallback = useRef((_: any) => { });

  let clearRound = useCallback(() => {
    intro.pause();
    intro.onended = null;

    music.pause();

    bell.pause();
    bell.currentTime = 0;

    warning.pause();
    warning.currentTime = 0;

    buzzer.pause();
    buzzer.currentTime = 0;

    if (roundTimer) {
      clearTimeout(roundTimer);
    }

    if (warningTimer) {
      clearTimeout(warningTimer);
    }

    setRoundTimer(undefined);
    setWarningTimer(undefined);
    setRoundState(RoundTimerState.Ready);
  }, [music, roundTimer, warningTimer, intro, bell, warning, buzzer]);

  let endRound = useCallback(() => {
    setRoundTimer(undefined);
    setWarningTimer(undefined);
    setStartTime(Date.now());
    setRoundState(RoundTimerState.Ending);

    buzzer.onended = clearRound;
    buzzer.play();
  }, [clearRound, buzzer]);

  let startRound = useCallback(() => {
    setRoundState(RoundTimerState.Intro);

    intro.src = getIntroToPlay();
    intro.currentTime = 0;
    introCompleteCallback.current = function scheduleRound(_: any) {
      bell.play();

      let timerId = setTimeout(endRound, durationMs);
      let warningTimerId = setTimeout(() => warning.play(), durationMs - 6000);

      setRoundState(RoundTimerState.Running);
      setRoundTimer(timerId);
      setWarningTimer(warningTimerId);
      setStartTime(Date.now());
    }
    intro.onended = introCompleteCallback.current;
    intro.play();

    if ((music.duration - music.currentTime * 2) * 1000 < durationMs) {
      music.currentTime = 0;
    }

    music.volume = 0.5;
    music.play();
  }, [music, durationMs, endRound, intro, warning, bell]);

  let delta = Date.now() - startTime;
  let elapsed = computeElapsed(state, delta, durationMs);
  let remaining = computeRemaining(state, delta, durationMs);

  applyMusicMods(music, state, delta, elapsed, remaining);

  return {
    state,
    startRound: state === RoundTimerState.Ready ? startRound : undefined,
    clearRound,
    elapsed,
    remaining
  };
}

type RoundProps = {
  difficulty: DifficultyLevel,
  music: HTMLAudioElement
}

export function Round({ difficulty, music }: RoundProps) {
  let duration = useDifficultyTime(difficulty);
  let { state, startRound, clearRound, elapsed, remaining } = useRoundTimer(duration * 1000, music);
  // let elapsedSeconds = Math.floor(elapsed / 1000);
  let remainingSeconds = Math.ceil(remaining / 1000);

  let timerClass = remaining < 6000 ? `${s.timeRemaining} ${s.lowTime}` : s.timeRemaining;

  return <>
    <div className={s.timer}>
      <div className={timerClass}>
        {remainingSeconds}
      </div>
      <div>
        {
          startRound && <button className={s.timerButton} onClick={startRound}>Start</button>
        }
        {
          state !== RoundTimerState.Ready &&
          <button className={s.timerButton} onClick={clearRound}>Stop</button>
        }
      </div>
    </div>
    {/* {
      typeof document !== 'undefined' &&
      <div className={s.debugBar}>
        <div><b>DEBUG</b> E: {elapsedSeconds} R: {remainingSeconds} V: {Math.round(music.volume * 100) / 100} T: {Math.round(music.playbackRate * 100) / 100} S: {state}</div>
      </div>
    } */}
  </>;
}
