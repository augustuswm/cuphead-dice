import { DifficultyLevel } from "../data/difficulty";
import { useSetting } from "./Settings";
import { useSelectSettingClip } from "./sfx";
import { useCallback } from "react";
import s from '../styles/Settings.module.css';

type DifficultySelectProps = {
  disabled?: boolean
}

export default function DifficultySelect({ disabled = false }: DifficultySelectProps) {
  let [difficulty, setDifficulty] = useSetting('difficulty');
  let selectSfx = useSelectSettingClip();

  let updateDifficulty = useCallback((difficulty) => {
    selectSfx.pause();
    selectSfx.currentTime = 0;
    selectSfx.play();
    setDifficulty(difficulty);
  }, [selectSfx, setDifficulty]);

  return <div className={s.gameSetting}>
    DIFFICULTY:
    <ul className={s.settingOptions}>
      <li className={s.settingOption} data-selected={difficulty === DifficultyLevel.TEN ? 'true' : 'false'}>
        <button onClick={() => updateDifficulty(DifficultyLevel.TEN)} disabled={disabled}>
          {DifficultyLevel.TEN}
        </button>
      </li>
      <li className={s.settingOption} data-selected={difficulty === DifficultyLevel.FIFTEEN ? 'true' : 'false'}>
        <button onClick={() => updateDifficulty(DifficultyLevel.FIFTEEN)} disabled={disabled}>
          {DifficultyLevel.FIFTEEN}
        </button>
      </li>
      <li className={s.settingOption} data-selected={difficulty === DifficultyLevel.TWENTY ? 'true' : 'false'}>
        <button onClick={() => updateDifficulty(DifficultyLevel.TWENTY)} disabled={disabled}>
          {DifficultyLevel.TWENTY}
        </button>
      </li>
      <li className={s.settingOption}>
        seconds
      </li>
    </ul>
  </div>;
}