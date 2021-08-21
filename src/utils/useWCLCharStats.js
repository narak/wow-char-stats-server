import axios from 'axios';
import { useEffect, useState } from 'react';
import promiseCache from './promiseCache';

import { ZoneId, DifficultyId } from '../constants/WarcraftLogs';

function serialize({ id, difficulty }, { name, server, region }) {
  return `${id}:${difficulty}:${region}:${server}:${name}`;
}

const query = ({ id, difficulty }, { name, server, region }) => `
{
  characterData {
    character(
      name: "${name}"
      serverSlug: "${server}"
      serverRegion: "${region}"
    ) {
      zoneRankings(
        difficulty: ${DifficultyId[difficulty]}
        zoneID: ${ZoneId[id]}
        role: DPS
        metric: dps
      )
    }
  }
}
`;

const _cache = {};
console.log('See `wlCharStats` to view fetched RIO data.');

export default function useWCLCharStats({ zone, chars }) {
  const [vals, setVals] = useState({});
  const [_zone, setZone] = useState(zone);
  if (zone !== _zone) {
    setZone(zone);
    setVals({});
  }

  useEffect(() => {
    window.wlCharStats = _cache;

    const proms = [];
    chars.forEach(char => {
      const key = serialize(zone, char);

      if (_cache[key]) {
        if (!vals[key]) {
          setVals(vals => ({
            ...vals,
            [key]: _cache[key],
          }));
        }
        return;
      }

      _cache[key] = {
        isFetching: true,
      };
      setVals(vals => ({
        ...vals,
        [key]: _cache[key],
      }));

      const p = promiseCache(
        () =>
          axios
            .post('/api/wcl', {
              query: query(zone, char),
            })
            .then(resp => resp?.data),
        `${zone.id},${zone.difficulty},${char.name},${char.server},${char.region}`
      );
      p.then(data => {
        data.key = key;
        data.char = char;
        return data;
      }).catch(console.error);
      proms.push(p);
    });

    proms.length &&
      Promise.all(proms).then(results => {
        const vals = {};
        results.forEach(data => {
          const { key, char } = data;
          const charData = data?.data?.characterData?.character;
          _cache[key] = charData
            ? { ...charData, ...zone, ...char, syncedAt: data.syncedAt }
            : {
                message: 'Found no character stats',
                isError: true,
                ...zone,
                ...char,
              };

          if (data?.errors) {
            console.error(data.errors.map(e => e.message));
          }
          vals[key] = _cache[key];
        });
        setVals(vals);
      });
  }, [zone, chars, vals]);

  return vals;
}
