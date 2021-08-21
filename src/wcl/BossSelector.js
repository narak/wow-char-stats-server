import styles from './bossselector.module.css';

import { useState } from 'react';
import Immutable from 'immutable';
import { Modal, Select, Checkbox, Button } from 'antd';
const { Option } = Select;

import { DifficultyLabel } from '../constants/WarcraftLogs';

export default function BossSelector({ bosses = [], value = [], onChange }) {
  const [absVisibility, setABSVisibility] = useState(false);
  const [selected, setSelected] = useState(Immutable.Map());

  function onClose() {
    setABSVisibility(false);
  }
  function onSelect(boss, diff) {
    setSelected(value => {
      return value.setIn([boss, diff], true);
    });
  }

  return (
    <>
      <Select
        mode="multiple"
        allowClear
        style={{ minWidth: 700 }}
        value={value}
        onChange={onChange}
        placeholder="Select Bosses"
      >
        {bosses.map(key => {
          return <Option key={key}>{key}</Option>;
        })}
      </Select>
      <Modal
        title="Advanced Boss Selector"
        visible={absVisibility}
        onCancel={onClose}
        footer={
          <Button key="done" onClick={onClose} type="primary">
            Done
          </Button>
        }
        width={700}
      >
        <div className={styles.bossGrid}>
          <div />
          {Object.keys(DifficultyLabel).map(key => (
            <div key={key}>
              <Checkbox /> {DifficultyLabel[key]}
            </div>
          ))}
        </div>
        {bosses.map(boss => (
          <div className={styles.bossGridRow} key={boss}>
            <div>{boss}</div>
            {Object.keys(DifficultyLabel).map(key => (
              <div key={key}>
                <Checkbox
                  value={selected.getIn([boss, key]) || undefined}
                  onChange={onSelect.bind(this, boss, key)}
                />
              </div>
            ))}
          </div>
        ))}
      </Modal>
      <a onClick={() => setABSVisibility(true)}>Advanced</a>
    </>
  );
}
