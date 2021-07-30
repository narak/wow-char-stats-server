import styles from './char.module.css';

import { Fragment } from 'react';
import styled from 'styled-components';

import useRaiderIOStats from '../../utils/useRaiderIOStats';
import { DeleteFilled } from '@ant-design/icons';
import { Card, Avatar, Divider } from 'antd';

import LFGFilter from './LFGFilter';

const Crawled = styled.div`
	opacity: 0.8;
	margin-top: 10px;
	font-size: 0.8rem;
`;

export default function Char({ char, onDelete }) {
	const rio = useRaiderIOStats(char);

	if (!rio) {
		return null;
	}

	if (rio.error) {
		return (
			<Card className={styles.card}>
				<strong>{rio.error}</strong>
				<p>{rio.message}</p>
				<DeleteFilled onClick={onDelete} className={styles.delete} />
			</Card>
		);
	}

	const currentScores = rio.mythic_plus_scores_by_season[0].scores;
	const bestRuns = rio.mythic_plus_best_runs;

	const title = (
		<>
			<Avatar src={rio.thumbnail_url} className={styles.avatar} />
			<a
				href={rio.profile_url}
				target="_blank"
				rel="noreferrer"
				className={styles.avatarAnnex}
			>
				<strong>{rio.name}</strong>
				<small style={{ marginLeft: '10px' }}>
					{rio.race} {rio.class}
				</small>
			</a>
		</>
	);
	return (
		<Card className={styles.card}>
			<Card.Meta title={title} />
			<h3 className={styles.mainScore}>{currentScores.all}</h3>
			<h3 className={styles.avatarAnnex}>
				<DeleteFilled onClick={onDelete} className={styles.icon} />
			</h3>
			{currentScores.tank ? (
				<span className={styles.subscore}>
					<strong>Tank</strong>: {currentScores.tank}
				</span>
			) : null}
			{currentScores.healer ? (
				<span className={styles.subscore}>
					<strong>Healer</strong>: {currentScores.healer}
				</span>
			) : null}
			{currentScores.dps ? (
				<span className={styles.subscore}>
					<strong>DPS</strong>: {currentScores.dps}
				</span>
			) : null}
			<Divider />
			<div className={styles.grid}>
				<div>
					<strong>Dungeon</strong>
				</div>
				<div>
					<strong>Level</strong>
				</div>
				<div>
					<strong>Score</strong>
				</div>
				<div>
					<strong>+?</strong>
				</div>
				{bestRuns.map(run => {
					return (
						<Fragment key={run.dungeon}>
							<div>{run.dungeon}</div>
							<div>{run.mythic_level}</div>
							<div>{run.score}</div>
							<div>{run.num_keystone_upgrades}</div>
						</Fragment>
					);
				})}
			</div>
			<Crawled>Last crawled at {new Date(rio.last_crawled_at).toLocaleString()}</Crawled>
			<div className={styles.onHover}>
				<LFGFilter runs={bestRuns} />
			</div>
		</Card>
	);
}
