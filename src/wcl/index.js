import styles from './index.module.css';

import { useEffect, useState, useMemo, useCallback } from 'react';

import { Zone, Difficulty } from '../constants/WarcraftLogs';

import api from '../utils/api';
import useLocalStorage from '../utils/useLocalStorage';
import useWCLCharStats from '../utils/useWCLCharStats';
import { byBoss, getRows, getData } from '../helpers/consolidateWCLStats';
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

export default function ProviderChars(props) {
	const [lsChars, lsSetChars] = useLocalStorage('wlTrackedChars', []);
	const [apiChars, apiSetChars] = useState([]);

	useEffect(async () => {
		const resp = props.id ? await api.get('/chars/' + props.id) : null;
		if (resp?.data) {
			apiSetChars(resp.data.characters);
		}
	}, [props.id]);

	async function onApiSetChars(characters) {
		const resp = await api.put('/chars/' + props.id, {
			characters,
		});
		console.log(resp);
		if (resp.status === 200) {
			apiSetChars(resp.data.characters);
		}
	}

	return (
		<Index
			{...props}
			chars={props.id ? apiChars : lsChars}
			setChars={props.id ? onApiSetChars : lsSetChars}
		/>
	);
}

function Index({ id, chars, setChars }) {
	const [zone, setZone] = useLocalStorage('wlZone', {
		id: Zone.SOD,
		difficulty: Difficulty.Heroic,
	});
	const { id: zoneId } = zone;
	const [bosses, setBosses] = useLocalStorage('wlBosses', {});
	const allStats = useWCLCharStats({ zone, chars });

	const bossMap =
		bosses[zoneId] && bosses[zoneId].length
			? bosses[zoneId].reduce((acc, boss) => {
					acc[boss] = true;
					return acc;
			  }, {})
			: null;

	const stats = useMemo(() => {
		return byBoss(allStats);
	}, [allStats]);

	useEffect(() => {
		window.wlDPSStats = stats;
	}, []);

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

	const columns = useMemo(() => {
		return getRows({ stats, bossMap, onDelete });
	}, [stats, bossMap, onDelete]);

	const [dataSource, failedChars] = useMemo(() => {
		return getData({ stats, chars, bossMap, ...zone });
	}, [stats, chars, bossMap, zone]);

	function onDropCache() {
		dropCache();
		window.location.reload();
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
				<Table
					dataSource={dataSource}
					columns={columns}
					pagination={false}
					scroll={{ x: 1440, y: 750 }}
				/>
			</Content>
		</>
	);
}
