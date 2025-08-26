import { PlayArrowOutlined, TimelineOutlined } from '@mui/icons-material';
import { Badge, Icon } from '@mui/material';
import { LastChartConfig } from 'modules/data/localStorage/lastCharts';
import moment from 'moment';
import * as React from 'react';
import styles from './LastCharts.module.scss';

interface LastChartItemProps {
	config: LastChartConfig;
	onClick: () => void;
}

const LastChartItem: React.FC<LastChartItemProps> = ({ config, onClick }) => {
	const { points, fromTs, toTs } = config;

	return (
		<li className={styles.item} onClick={onClick}>
			<Badge overlap='rectangular' badgeContent={points.length || 0} color='primary' className={styles.badge}>
				<Icon>
					<TimelineOutlined className={styles.icon} />
				</Icon>
			</Badge>
			<div className={styles.content}>
				<div className={styles.points}>
					{points.map((point, index, arr) => (
						<span key={index}>
							<strong>{point.name || '???'}</strong>
							{index + 1 < arr.length ? ' |' : ''}
						</span>
					))}
				</div>
				<label>
					{fromTs && <span>Od: {moment(fromTs).format('ll')}</span>}
					{toTs && <span>Do: {moment(toTs).format('ll')}</span>}
				</label>
			</div>
			<Icon className={styles.play}>
				<PlayArrowOutlined />
			</Icon>
		</li>
	);
};

export default LastChartItem;
