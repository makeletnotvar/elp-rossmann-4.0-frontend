import { ErrorOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import Loader from 'modules/common/components/Loaders/Loader';
import { AsyncReducerState } from 'modules/common/helpers/redux/reducers';
import MediaParamsChart from 'modules/media/components/MediaTabs/MediaParams/MediaParamsChart/MediaParamsChart';
import MediaParamsSettings from 'modules/media/components/MediaTabs/MediaParams/MediaParamsSettings/MediaParamsSettings';
import React from 'react';
import styles from './MediaParams.module.scss';

interface MediaParamsViewProps {
	points: Point[];
	data: MergedDataPointsValue[];
	status: AsyncReducerState;
	settings: MediaParamsRequestSettings;
	onSubmit: (settings: MediaParamsRequestSettings) => void;
}

const MediaParamsView: React.FC<MediaParamsViewProps> = ({ points, data, status, settings, onSubmit }) => {
	return (
		<div className={styles.container}>
			<MediaParamsSettings values={settings} onSubmit={onSubmit} />
			{status.fetched && settings.fromTs && settings.toTs && data.length > 0 && (
				<div className={styles.dataContainer}>
					<MediaParamsChart
						{...{
							points,
							data,
							index: 0,
							from: settings.fromTs,
							to: settings.toTs,
							isLastChartContainer: true,
						}}
					/>
				</div>
			)}
			{status.fetching && (
				<div className={styles.dataContainer}>
					<Loader />
				</div>
			)}
			{!status.fetching && !status.fetched && data.length === 0 && (
				<div className={styles.dataContainer}>
					<Typography variant='h6' color='textSecondary' style={{ opacity: 0.2 }}>
						Brak danych
					</Typography>
				</div>
			)}
			{!status.fetching && status.fetched && data.length === 0 && (
				<div className={styles.dataContainer}>
					<Typography variant='h6' color='textSecondary' style={{ opacity: 0.2 }}>
						Brak danych dla podanych kryteriów
					</Typography>
				</div>
			)}
			{status.error && (
				<div className={styles.dataContainer}>
					<ErrorOutlined />
				</div>
			)}
		</div>
	);
};

export default MediaParamsView;
