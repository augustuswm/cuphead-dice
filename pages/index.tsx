import { motion } from 'framer-motion';
import Link from 'next/link';
import DifficultySelect from '../components/DifficultySelect';
import PlayerSelect from '../components/PlayerSelect';
import { useSelectBossClip } from '../components/sfx';
import { BOSSES } from '../data/bosses';
import { animations } from '../lib/animations';
import s from '../styles/Home.module.css';
import shared from '../styles/Shared.module.css';

export default function Home() {
  let selectBossAudio = useSelectBossClip();

  return <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={animations.fadeIn.variants}>
    <img className={s.logo} src="/textures/cuphead_logo.png" alt="" />
    <div className={`${shared.paperButton} ${shared.paperHeading}`}><b>SETTINGS</b></div>
    <DifficultySelect />
    <PlayerSelect />
    <ul className={s.bossList}>
      <li className={`${shared.paperButton} ${shared.paperHeading}`}><b>BOSSES</b></li>
      {
        Object.entries(BOSSES).map(([key, boss]) => {
          return <li key={key}>
            <Link href={`/boss/${key.toLowerCase()}`}>
              <a className={shared.paperButton} onClick={() => selectBossAudio.play()}>
                {boss.name.replace(/_/g, ' ')}
              </a>
            </Link>
          </li>;
        })
      }
    </ul>
  </motion.div>;
}