import { ErrorOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import Loader from 'modules/common/components/Loaders/Loader';
import { AsyncReducerState } from 'modules/common/helpers/redux/reducers';
import MediaConsumptionsChart from 'modules/media/components/MediaTabs/MediaConsumptions/MediaConsumptionsChart/MediaConsumptionsChart';
import MediaConsumptionsSettings from 'modules/media/components/MediaTabs/MediaConsumptions/MediaConsumptionsSettings/MediaConsumptionsSettings';
import React from 'react';
import styles from './MediaConsumptions.module.scss';

interface MediaConsumptionsViewProps {
	data: ConsumptionData;
	status: AsyncReducerState;
	settings: MediaConsumptionsRequestSettings;
	onSubmit: (settings: MediaConsumptionsRequestSettings) => void;
}

const MediaConsumptionsView: React.FC<MediaConsumptionsViewProps> = ({ data, status, settings, onSubmit }) => {
	return (
		<div className={styles.container}>
			<MediaConsumptionsSettings values={settings} onSubmit={onSubmit} />
			{status.fetched && settings.fromTs && settings.toTs && data.length > 0 && (
				<div className={styles.dataContainer}>
					<MediaConsumptionsChart data={data} period={settings.period} settings={settings} />
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

export default MediaConsumptionsView;
