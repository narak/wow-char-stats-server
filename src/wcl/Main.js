import styles from './main.module.css';

import { useEffect, useMemo, useCallback } from 'react';

import useWCLCharStats from '../utils/useWCLCharStats';
import exportToCSV from '../utils/exportToCSV';
import { byChar, getCols, getData } from '../helpers/consolidateWCLStats';
import { dropCache } from '../utils/promiseCache';

import { Layout, Table, Button } from 'antd';
import AddChar from '../common/AddChar';
import ZoneSelector from './ZoneSelector';
import BossSelector from './BossSelector';
import CopyPaste from './CopyPaste';

const { Content } = Layout;

function cleanServer(realm) {
  return realm.replace(/-|\s/g, '').toLowerCase();
}

console.log('See `wlDPSStats` to view consolidated stats.');

export default function Main({ chars, setChars, zone, setZone, bosses, setBosses }) {
  const { id: zoneId } = zone;

  function onDropCache() {
    dropCache();
    window.location.reload();
  }

  function onAdd(char) {
    let { name, server, region } = char;
    name = name.toLowerCase();
    server = cleanServer(server);
    region = region.toLowerCase();
    const exists = chars.some(_char => {
      const _server = cleanServer(_char.server);
      if (
        _char.name.toLowerCase() === name &&
        _server === server &&
        _char.region.toLowerCase() === region
      ) {
        console.warn('User already exists');
        return true;
      } else {
        return false;
      }
    });

    if (!exists) {
      setChars([...chars, char]);
    }
  }

  function onChangeSelectedBosses(value) {
    setBosses({ ...bosses, [zoneId]: value });
  }

  const onDelete = useCallback(
    name => {
      setChars(chars.filter(char => char.name !== name));
    },
    [setChars, chars]
  );

  const allStats = useWCLCharStats({ zone, chars });

  const bossMap =
    bosses[zoneId] && bosses[zoneId].length
      ? bosses[zoneId].reduce((acc, boss) => {
          acc[boss] = true;
          return acc;
        }, {})
      : null;

  const stats = useMemo(() => {
    return byChar(allStats);
  }, [allStats]);

  useEffect(() => {
    window.wlDPSStats = stats;
  }, [stats]);

  const columns = useMemo(() => {
    return getCols({
      stats,
      bossMap,
      onDelete,
      hightlightClassName: styles.ranked,
      tooltipClassName: styles.tooltip,
    });
  }, [stats, bossMap, onDelete]);

  const [dataSource, failedChars] = useMemo(() => {
    return getData({ stats, chars, bossMap, ...zone });
  }, [stats, chars, bossMap, zone]);

  const onGenerateCSV = useCallback(() => {
    exportToCSV(columns, dataSource);
  }, [columns, dataSource]);

  const scrollCfg = { x: 1500 };
  if (typeof window !== 'undefined') {
    scrollCfg.y = document.body.clientHeight - 400;
  }

  return (
    <>
      <div className={styles.copyPaste}>
        <CopyPaste chars={chars} setChars={setChars} />
      </div>
      <Content style={{ padding: '50px 50px 10px' }}>
        <AddChar onAdd={onAdd} />
      </Content>
      <Content style={{ padding: '10px 50px' }}>
        <ZoneSelector value={zone} onChange={setZone} />
      </Content>
      <Content style={{ padding: '10px 50px 10px' }}>
        <BossSelector
          bosses={stats && stats.bosses ? stats.bosses : undefined}
          value={bosses[zoneId]}
          onChange={onChangeSelectedBosses}
        />
      </Content>
      <Content style={{ padding: '10px 50px 50px' }}>
        <Button
          style={{
            float: 'right',
          }}
          type="text"
          onClick={onDropCache}
        >
          Refresh Stats
        </Button>
        <Button
          style={{
            float: 'right',
          }}
          type="text"
          onClick={onGenerateCSV}
        >
          Export CSV
        </Button>
        {failedChars.length ? (
          <div style={{ padding: '0 1px' }}>
            <strong>Failed to fetch</strong>:{' '}
            {failedChars.map(char =>
              char ? (
                <Button type="text" onClick={onDelete.bind(this, char.name)} key={char.name}>
                  {char.name}
                </Button>
              ) : null
            )}
          </div>
        ) : null}
        <Table dataSource={dataSource} columns={columns} pagination={false} scroll={scrollCfg} />
      </Content>
    </>
  );
}
