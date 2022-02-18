import { useState } from "react";
import { Grade, GRADES } from "../data/grades";
import s from '../styles/Score.module.css';

type ScoreScreenProps = {
  players: number
  difficulty: number
}

function getGrade(players: number, score: number): Grade {
  let passed = GRADES[players].filter(grade => grade.threshold < score);
  return passed[passed.length - 1];
}

export function ScoreScreen({ players, difficulty }: ScoreScreenProps) {
  let [remainingHP, setRemainingHP] = useState(1 * players);
  let [remainingParries, setRemainingParries] = useState(0);
  let [remainingWallops, setRemainingWallops] = useState(0);
  let [timeTokens, setTimeTokens] = useState(0);

  let possibleHP = [...new Array(3 * players)].map((_, i) => i + 1);
  possibleHP.unshift();

  let possibleParries = [...new Array(3 * players + 1)].map((_, i) => i);

  let score = remainingHP * 10 +
    remainingParries * 5 +
    remainingWallops * 5 +
    timeTokens * -10 +
    (20 - difficulty) * 2;

  let grade = getGrade(players, score);

  return <div className={s.layerWrapper}>
    <div className={s.background}>
      <div className={s.scoreContent}>
        <h2 className={s.resultsHeading}>The Results</h2>
        <div className={s.scoreInput}>
          Remaining HP:
          <select value={remainingHP} onChange={e => setRemainingHP(parseInt(e.target.value))}>
            {
              possibleHP.map(i => {
                return <option key={i}>{i}</option>
              })
            }
          </select>
        </div>
        <div className={s.scoreInput} >
          Remaining Parries:
          <select value={remainingParries} onChange={e => setRemainingParries(parseInt(e.target.value))}>
            {
              possibleParries.map(i => {
                return <option key={i}>{i}</option>
              })
            }
          </select>
        </div>
        <div className={s.scoreInput} >
          Remaining Wallops:
          <select value={remainingWallops} onChange={e => setRemainingWallops(parseInt(e.target.value))}>
            {
              possibleParries.map(i => {
                return <option key={i}>{i}</option>
              })
            }
          </select>
        </div>
        <div className={s.scoreInput} >
          Time Tokens:
          <select value={timeTokens} onChange={e => setTimeTokens(parseInt(e.target.value))}>
            {
              possibleParries.map(i => {
                return <option key={i}>{i}</option>
              })
            }
          </select>
        </div>
        <table className={s.scoreTable}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Points</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>HP</td><td>10</td><td>{remainingHP}</td><td>{remainingHP * 10}</td></tr>
            <tr><td>Parries</td><td>5</td><td>{remainingParries}</td><td>{remainingParries * 5}</td></tr>
            <tr><td>Wallops</td><td>5</td><td>{remainingWallops}</td><td>{remainingWallops * 5}</td></tr>
            <tr><td>Time Tokens</td><td>-10</td><td>{timeTokens}</td><td>{timeTokens * -10}</td></tr>
            <tr><td>Time Bonus</td><td></td><td></td><td>{(20 - difficulty) * 2}</td></tr>
          </tbody>
          <tfoot>
            <tr><td></td><td></td><td></td><td>{score}</td></tr>
          </tfoot>
        </table>
        <div className={s.gradePanel}>
          GRADE: <span className={s.finalGrade}>{grade.letter}</span>
        </div>
      </div>
    </div>
  </div>;
}