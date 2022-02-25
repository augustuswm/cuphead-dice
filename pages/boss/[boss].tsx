import { motion } from 'framer-motion';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ActiveBoss } from '../../components/Boss';
import DifficultySelect from '../../components/DifficultySelect';
import { useHistory } from '../../components/RouteHistory';
import { useSetting } from '../../components/Settings';
import { Boss, BOSSES } from '../../data/bosses';
import { animations } from '../../lib/animations';
import s from '../../styles/Home.module.css';
import shared from '../../styles/Shared.module.css';

type BossPageProps = {
  boss: Boss
}

export default function BossPage({ boss }: BossPageProps) {
  let history = useHistory();
  let router = useRouter();

  let [difficulty, setDifficulty] = useSetting('difficulty');
  let [roundInProgress, setRoundInProgress] = useState(false);

  let animation = history.last() === '/score' ? animations.fadeIn : animations.fadeFront;

  return <motion.div
    className={s.animator}
    initial="initial"
    animate="animate"
    exit="exit"
    variants={animation.variants}>
    <div className={shared.frame}>
      <ActiveBoss
        difficulty={difficulty}
        boss={boss}
        onRoundIntro={() => setRoundInProgress(true)}
        onRoundComplete={() => setRoundInProgress(false)}
        onComplete={() => {
          router.push('/score');
        }}
      />

      <div className={`${shared.paperButton} ${shared.paperHeading}`}><b>SETTINGS</b></div>
      <DifficultySelect disabled={roundInProgress} />
    </div>
  </motion.div>;
}

export async function getStaticProps(ctx: GetServerSidePropsContext) {
  let boss = BOSSES[(ctx.params?.boss as string).toUpperCase()];

  return { props: { boss } };
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(BOSSES).map(k => `/boss/${k.toLowerCase()}`),
    fallback: 'blocking'
  }
}