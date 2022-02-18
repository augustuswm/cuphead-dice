import { useSetting } from "./Settings";
import { useSelectSettingClip } from "./sfx";
import { useCallback } from "react";
import s from '../styles/Settings.module.css';

export default function PlayerSelect() {
  let [players, setPlayers] = useSetting('players');
  let selectSfx = useSelectSettingClip();

  let updatePlayers = useCallback((players) => {
    selectSfx.pause();
    selectSfx.currentTime = 0;
    selectSfx.play();
    setPlayers(players);
  }, [selectSfx, setPlayers]);

  return <div className={s.gameSetting}>
    PLAYERS:
    <ul className={s.settingOptions}>
      <li className={s.settingOption} data-selected={players === 2 ? 'true' : 'false'}>
        <button onClick={() => updatePlayers(2)}>
          Two
        </button>
      </li>
      <li className={s.settingOption} data-selected={players === 3 ? 'true' : 'false'}>
        <button onClick={() => updatePlayers(3)}>
          Three
        </button>
      </li>
      <li className={s.settingOption} data-selected={players === 4 ? 'true' : 'false'}>
        <button onClick={() => updatePlayers(4)}>
          Four
        </button>
      </li>
    </ul>
  </div>;
}