import { useEffect, useRef, useState } from "react";
import { useMountedState, useRaf } from "react-use";
import { useLongPress } from "use-long-press";
import { Boss } from "../data/bosses";
import { DifficultyLevel } from "../data/difficulty";
import { useAudioClip } from "./hooks";
import { Round, RoundTimerEvents } from "./Round";
import { motion } from "framer-motion";
import s from '../styles/Boss.module.css';
import { useBoomClip, useKnockoutClip } from "./sfx";
import { useRouter } from "next/router";

export type BossProps = {
  difficulty: DifficultyLevel
  boss: Boss
  players: number
}

function getThumbnail(boss: Boss): string {
  return `/textures/${boss.sprite}.png`;
}

type KOHighlightProps = {
  holdMs: number
  onComplete: () => void
  maskUrl: string
}

function opacityCalc(percentComplete: number): number {
  return 1.6666666666666667 * percentComplete - 0.41666666666666674;
}

function BossKOHighlight({ holdMs, onComplete, maskUrl }: KOHighlightProps) {
  let [complete, setComplete] = useState(false);
  let start = useRef(Date.now());
  let _ = useRaf(holdMs, 0);
  let isMounted = useMountedState();

  let percentComplete = Math.min(1, Math.max(0, (Date.now() - start.current) / holdMs));
  let translate = Math.round((1 - percentComplete) * 80 * 100) / 100 + 10;

  if (percentComplete === 1 && !complete) {
    if (isMounted()) {
      setComplete(true);
    }

    if (onComplete) {
      onComplete();
    }
  }

  let mask = `url(${maskUrl})`;
  let maskStyle = { maskImage: mask, WebkitMaskImage: mask };

  return <>
    <div className={s.koHighlightMask} style={maskStyle}>
      <div className={s.koHighlight} style={{ transform: `translateY(${translate}%)` }} />
    </div>
    <div className={s.koHighlightText} style={{ opacity: opacityCalc(percentComplete) }}>KO</div>
  </>;
}

type ActiveBossProps = {
  boss: Boss
  difficulty: number
  onComplete?: () => void
} & RoundTimerEvents

export function ActiveBoss({ difficulty, boss, onRoundIntro, onRoundStart, onRoundEnd, onRoundComplete, onComplete }: ActiveBossProps) {
  let music = useAudioClip(`/music/${boss.track}.mp3`);

  let [bossComplete, setBossComplete] = useState(false);

  let boomClip = useBoomClip(true);
  let knockoutClip = useKnockoutClip(true);
  let [holdingForKO, setHoldingForKO] = useState(false);
  let longPressBinding = useLongPress(() => { }, {
    onStart: () => {
      setHoldingForKO(true);
      boomClip.play();
    },
    onFinish: () => {
      setHoldingForKO(false);
      boomClip.pause();
      boomClip.currentTime = 0;
    },
    onCancel: () => {
      setHoldingForKO(false);
      boomClip.pause();
      boomClip.currentTime = 0;
    },
  });

  let formattedName = boss.name.replace(/_/g, ' ');

  return <div className={s.layerWrapper}>
    <div className={s.background}>
      <div className={s.bossContent}>
        <h2 className={s.bossName}>{formattedName}</h2>
        <motion.div animate={{ scale: holdingForKO ? 0.95 : 1 }} className={s.bossThumbnailScaler}>
          <div className={s.bossThumbnail} {...longPressBinding} >
            <div className={s.bossBackdrop} />
            <img id="boss-thumbnail" src={getThumbnail(boss)} alt={formattedName} />
            {
              (holdingForKO || bossComplete) &&
              <BossKOHighlight holdMs={2500} maskUrl={getThumbnail(boss)} onComplete={() => {
                setBossComplete(true);
                knockoutClip.play();
                if (onComplete) {
                  onComplete();
                }
              }} />
            }
          </div>
        </motion.div>
        {
          difficulty &&
          <Round difficulty={difficulty} music={music} onRoundIntro={onRoundIntro} onRoundStart={onRoundStart} onRoundEnd={onRoundEnd} onRoundComplete={onRoundComplete} />
        }
      </div>
    </div>
  </div >;
}