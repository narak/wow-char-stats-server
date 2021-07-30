import axios from 'axios';
import { useEffect, useState } from 'react';
import useWCLAuthToken from './useWCLAuthToken';
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
	const token = useWCLAuthToken();
	const [vals, setVals] = useState({});
	const [_zone, setZone] = useState(zone);
	if (zone !== _zone) {
		setZone(zone);
		setVals({});
	}

	useEffect(() => {
		window.wlCharStats = _cache;
		if (!token) {
			return;
		}
		const config = {
			headers: { Authorization: `Bearer ${token}` },
		};

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

			promiseCache(
				() =>
					axios
						.post(
							'https://www.warcraftlogs.com/api/v2/client',
							{
								query: query(zone, char),
							},
							config
						)
						.then(resp => resp?.data),
				`${zone.id},${zone.difficulty},${char.name},${char.server},${char.region}`
			)
				.then(data => {
					const charData = data?.data?.characterData?.character;
					_cache[key] = charData
						? { ...charData, ...zone, ...char }
						: {
								message: 'Found no character stats',
								isError: true,
								...zone,
								...char,
						  };

					if (data?.errors) {
						console.error(data.errors.map(e => e.message));
					}
					setVals(vals => ({
						...vals,
						[key]: _cache[key],
					}));
				})
				.catch(console.error);
		});
	}, [zone, chars, token, vals]);

	return vals;
}
