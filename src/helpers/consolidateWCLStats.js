import formatDate from '../utils/formatDate';
import { ZoneId, DifficultyId } from '../constants/WarcraftLogs';
import { ShortName } from '../constants/Boss';

import { Tooltip } from 'antd';
import { DeleteFilled } from '@ant-design/icons';

function getWclUrl({ region, server, name, difficulty, zoneId }) {
  return `https://www.warcraftlogs.com/character/${region}/${server}/${name}#difficulty=${DifficultyId[difficulty]}&zone=${ZoneId[zoneId]}`;
}

function calcRanks({ byBoss, bosses }) {
  // console.log(byBoss, bosses);
}

export function byBoss(allStats) {
  let byBoss = {},
    bosses = {},
    syncedAt = {};

  for (const key in allStats) {
    const val = allStats[key];

    if (val.isFetching) continue;
    const name = val.name,
      rankings = val.zoneRankings?.rankings;

    syncedAt[name] = val.syncedAt;

    // eslint-disable-next-line
    byBoss[name] = rankings
      ? rankings.map(rank => {
          const boss = rank.encounter.name;

          if (!bosses[boss]) {
            bosses[boss] = true;
          }

          return {
            boss,
            bestAmount: rank.bestAmount,
            bestSpec: rank.bestSpec,
            rankPercent: rank.rankPercent,
          };
        })
      : val.isError
      ? val
      : undefined;
  }

  const o = { byBoss: byBoss, bosses: Object.keys(bosses), syncedAt };
  calcRanks(o);
  return o;
}

export function getRows({ stats, bossMap, onDelete }) {
  let columns;
  if (stats.bosses.length) {
    columns = stats.bosses.reduce((acc, boss) => {
      if (!bossMap || bossMap[boss]) {
        acc.push({
          title: ShortName[boss],
          dataIndex: boss,
          key: boss,
          className: 'blah',
          render: (text, record, index) => {
            const rec = record[boss];
            if (+rec.value === 0) {
              return '-';
            } else {
              return (
                <>
                  <Tooltip placement="bottom" title={`${rec.rankPercent}%`}>
                    {rec.value}
                  </Tooltip>
                  <br />
                  <small>{rec.spec}</small>
                </>
              );
            }
          },
          sorter: (a, b) => {
            return a[boss].value - b[boss].value;
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

  if (stats.bosses.length) {
    chars.forEach(char => {
      const { name } = char;
      const bossStats = stats.byBoss[name];
      if (bossStats && !bossStats.isError) {
        dataSource.push({
          Name: name,
          key: name,
          syncedAt: stats.syncedAt[name],
          zoneId,
          difficulty,
          ...char,
          ...bossStats.reduce((acc, val) => {
            if (!bossMap || bossMap[val.boss]) {
              acc[val.boss] = {
                value: val.bestAmount.toFixed(2),
                spec: val.bestSpec,
                rankPercent: val.rankPercent?.toFixed(2),
              };
            }
            return acc;
          }, {}),
        });
      } else {
        failedChars.push(bossStats);
      }
    });
  }
  return [dataSource, failedChars];
}
