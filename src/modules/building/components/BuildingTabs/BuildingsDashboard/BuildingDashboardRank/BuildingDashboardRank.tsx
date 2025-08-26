import { StarHalfOutlined, StarOutlined } from '@mui/icons-material';
import * as React from 'react';
import styles from './BuildingDashboardRank.module.scss';

interface BuildingDashboardRankProps {}

const BuildingDashboardRank: React.FC<BuildingDashboardRankProps> = ({}) => {
	return (
		<div className={styles.container}>
			<div className={styles.param}>
				<div className={styles.rank}>
					<div className={styles.label}>Miejsce wg zużycia</div>
					<div className={styles.value}>
						<strong>27</strong>
						<span>/647</span>
					</div>
				</div>
			</div>
			<div className={styles.param}>
				<div className={styles.rate}>
					<div className={styles.label}>Ocena</div>
					<div className={styles.value}>4.41</div>
					<div className={styles.stars}>
						<StarOutlined />
						<StarOutlined />
						<StarOutlined />
						<StarOutlined />
						<StarHalfOutlined />
					</div>
				</div>
			</div>
		</div>
	);
};

export default BuildingDashboardRank;
