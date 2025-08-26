import { ReportProblemOutlined, WifiOffOutlined, WifiOutlined } from '@mui/icons-material';
import { Box, Paper, Tooltip } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MapInfo.module.scss';

interface MapInfoProps {
	statistics: MapBuildingStats;
}

const MapInfo: React.FC<MapInfoProps> = ({ statistics }) => {
	const { t } = useTranslation();
	return (
		<Paper className={styles.container} elevation={0}>
			<Box p={0.5} className={styles.content}>
				<Box className={styles.item}>
					<Tooltip title='Drogerie online'>
						<span className={styles.item}>
							<WifiOutlined className={styles.itemIcon} fontSize='inherit' />
							<Box data-testid='map-info-online' className={styles.itemText}>
								{Math.abs(statistics?.total - statistics?.offline || 0)}
							</Box>
						</span>
					</Tooltip>
				</Box>
				<Box className={styles.item}>
					<Tooltip title='Drogerie offline'>
						<span className={styles.item}>
							<WifiOffOutlined className={styles.itemIcon} fontSize='inherit' />
							<Box data-testid='map-info-offline' className={styles.itemText}>
								{statistics?.offline || 0}
							</Box>
						</span>
					</Tooltip>
				</Box>
				<Box className={styles.item}>
					<Tooltip title='Drogerie z alarmem'>
						<span className={styles.item}>
							<ReportProblemOutlined className={styles.itemIcon} fontSize='inherit' />
							<Box data-testid='map-info-alarm' className={styles.itemText}>
								{statistics?.alarm || 0}
							</Box>
						</span>
					</Tooltip>
				</Box>
			</Box>
		</Paper>
	);
};

export default MapInfo;
