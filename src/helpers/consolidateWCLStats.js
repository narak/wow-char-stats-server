import formatDate from '../utils/formatDate';
import { ZoneId, DifficultyId } from '../constants/WarcraftLogs';
import { ShortName } from '../constants/Boss';

import { Tooltip } from 'antd';
import { DeleteFilled } from '@ant-design/icons';

function getWclUrl({ region, server, name, difficulty, zoneId }) {
  return `https://www.warcraftlogs.com/character/${region}/${server}/${name}#difficulty=${DifficultyId[difficulty]}&zone=${ZoneId[zoneId]}`;
}

export function getRanks({ byChar, bosses, byBoss }, chars) {
  // let st = performance.now();
  const sortedByBoss = {};

  bosses.forEach(boss => {
    chars.forEach(({ name }) => {
      const o = byBoss[boss][name];
      o.name = name;

      let sorted = sortedByBoss[boss];
      if (!sorted) {
        sorted = [o];
      } else {
        let idx = sorted.length;
        sorted.some((val, i) => {
          if (o.bestAmount > val.bestAmount) {
            idx = i;
            return true;
          }
        });
        sorted.splice(idx, 0, o);
      }

      sortedByBoss[boss] = sorted;
    });
  });

  const ranked = {};
  bosses.forEach(boss => {
    ranked[boss] = {};
    sortedByBoss[boss].forEach((char, i) => {
      ranked[boss][char.name] = i + 1;
    });
  });
  // let et = (performance.now() - st).toFixed(3);
  // console.log(et + 'ms' /*, i*/);
  return ranked;
}

export function byChar(allStats) {
  let byChar = {},
    byBoss = {},
    bosses = {},
    syncedAt = {};

  for (const key in allStats) {
    const val = allStats[key];

    if (val.isFetching) continue;
    const name = val.name,
      rankings = val.zoneRankings?.rankings;

    syncedAt[name] = val.syncedAt;

    // eslint-disable-next-line
    byChar[name] = {};

    if (rankings) {
      rankings.forEach(rank => {
        const boss = rank.encounter.name;

        if (!bosses[boss]) {
          bosses[boss] = true;
        }
        byBoss[boss] = byBoss[boss] || {};
        byBoss[boss][name] = byChar[name][boss] = {
          bestAmount: rank.bestAmount,
          bestSpec: rank.bestSpec,
          rankPercent: rank.rankPercent,
        };
      });
    } else if (val?.isError) {
      byChar[name] = val.isError;
    } else {
      byChar[name] = val;
    }
  }

  return { byChar, byBoss, bosses: Object.keys(bosses), syncedAt };
}

export function getCols({ stats, bossMap, onDelete, hightlightClassName }) {
  let columns;
  if (stats.bosses.length) {
    columns = stats.bosses.reduce((acc, boss) => {
      if (!bossMap || bossMap[boss]) {
        acc.push({
          title: ShortName[boss],
          dataIndex: boss,
          key: boss,
          render: (text, record, index) => {
            const rec = record.bossStats[boss];
            if (rec.bestAmount === 0) {
              return null;
            } else {
              return {
                props: {
                  className: record.ranked[boss][record.Name] <= 14 ? hightlightClassName : '',
                },
                children: (
                  <>
                    <Tooltip placement="bottom" title={`${rec.rankPercent?.toFixed(2)}%`}>
                      {rec.bestAmount.toFixed(2)}
                      <br />
                      <small>{rec.bestSpec}</small>
                    </Tooltip>
                  </>
                ),
              };
            }
          },
          sorter: (a, b) => {
            return a.bossStats[boss].bestAmount - b.bossStats[boss].bestAmount;
          },
        });
      }
      return acc;
    }, []);
  } else {
    columns = [];
  }

  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'Name',
      fixed: 'left',
      render: (text, record) => {
        return (
          <>
            <a href={getWclUrl(record)} target="_blank" rel="noreferrer">
              {record.name}
            </a>
            <br />
            <small>{record.syncedAt ? formatDate(new Date(record.syncedAt)) : ''}</small>
          </>
        );
      },
    },
    ...columns,
    {
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: '50px',
      render: (text, record) => {
        return <DeleteFilled onClick={onDelete.bind(this, record.name)} />;
      },
    },
  ];
}

export function getData({ stats, chars, bossMap, id: zoneId, difficulty }) {
  const dataSource = [];
  const failedChars = [];
  const ranked = getRanks(stats, chars);

  if (stats.bosses.length) {
    chars.forEach(char => {
      const { name } = char;
      const bossStats = stats.byChar[name];
      if (bossStats && !bossStats.isError) {
        dataSource.push({
          Name: name,
          key: name,
          syncedAt: stats.syncedAt[name],
          zoneId,
          difficulty,
          ...char,
          bossStats,
          ranked,
        });
      } else {
        failedChars.push(bossStats);
      }
    });
  }
  return [dataSource, failedChars];
}
