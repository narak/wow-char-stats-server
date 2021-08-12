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

export function byChar(allStats) {
  let byChar = {},
    bosses = {},
    syncedAt = {};

  for (const key in allStats) {
    const val = allStats[key];

    if (val.isFetching) continue;
    const name = val.name,
      rankings = val.zoneRankings?.rankings;

    syncedAt[name] = val.syncedAt;

    // eslint-disable-next-line
    byChar[name] = rankings
      ? rankings.reduce((acc, rank) => {
          const boss = rank.encounter.name;

          if (!bosses[boss]) {
            bosses[boss] = true;
          }

          acc[boss] = {
            bestAmount: rank.bestAmount,
            bestSpec: rank.bestSpec,
            rankPercent: rank.rankPercent,
          };
          return acc;
        }, {})
      : val.isError
      ? val
      : undefined;
  }

  const o = { byChar: byChar, bosses: Object.keys(bosses), syncedAt };
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
                  <Tooltip placement="bottom" title={`${rec.rankPercent?.toFixed(2)}%`}>
                    {rec.bestAmount.toFixed(2)}
                    <br />
                    <small>{rec.bestSpec}</small>
                  </Tooltip>
                </>
              );
            }
          },
          sorter: (a, b) => {
            return a[boss].bestAmount - b[boss].bestAmount;
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
      const bossStats = stats.byChar[name];
      if (bossStats && !bossStats.isError) {
        dataSource.push({
          Name: name,
          key: name,
          syncedAt: stats.syncedAt[name],
          zoneId,
          difficulty,
          ...char,
          ...bossStats,
        });
      } else {
        failedChars.push(bossStats);
      }
    });
  }
  return [dataSource, failedChars];
}
