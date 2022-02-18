import { motion } from 'framer-motion';
import DifficultySelect from '../components/DifficultySelect';
import PlayerSelect from '../components/PlayerSelect';
import { ScoreScreen } from '../components/Score';
import { useSetting } from '../components/Settings';
import { animations } from '../lib/animations';
import s from '../styles/Home.module.css';
import shared from '../styles/Shared.module.css';

export default function ScorePage() {
  let [difficulty] = useSetting('difficulty');
  let [players] = useSetting('players');

  let animation = animations.fadeFront;

  return <motion.div
    className={s.animator}
    initial="initial"
    animate="animate"
    exit="exit"
    variants={animation.variants}>
    <div className={shared.frame}>
      {
        difficulty && players && <ScoreScreen difficulty={difficulty} players={players} />
      }
      <div className={`${shared.paperButton} ${shared.paperHeading}`}><b>SETTINGS</b></div>
      <DifficultySelect />
      <PlayerSelect />
    </div>
  </motion.div>;
}