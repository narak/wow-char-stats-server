import styles from './zoneselector.module.css';

import { Zone, ZoneLabel, Difficulty, DifficultyLabel } from '../constants/WarcraftLogs';

import { Select } from 'antd';
const { Option } = Select;

const Zones = Object.keys(ZoneLabel);
const Difficulties = Object.keys(DifficultyLabel);

export default function ZoneSelector({ value, onChange }) {
  const { id, difficulty } = value;

  function onSetZone(id) {
    onChange({
      ...value,
      id,
    });
  }
  function onSetDifficulty(difficulty) {
    onChange({
      ...value,
      difficulty,
    });
  }
  return (
    <div className={styles.cont}>
      <div className={styles.field}>
        <Select style={{ width: 240 }} value={id} onChange={onSetZone}>
          {Zones.map(key => {
            return (
              <Option value={key} key={key}>
                {ZoneLabel[key]}
              </Option>
            );
          })}
        </Select>
      </div>
      <div className={styles.field}>
        <Select style={{ width: 160 }} value={difficulty} onChange={onSetDifficulty}>
          {Difficulties.map(key => {
            return (
              <Option value={key} key={key}>
                {DifficultyLabel[key]}
              </Option>
            );
          })}
        </Select>
      </div>
    </div>
  );
}
