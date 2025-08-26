import { CloseOutlined, DataUsageOutlined, DateRangeOutlined, TimelineOutlined } from '@mui/icons-material';
import { IconButton, Typography, Zoom } from '@mui/material';
import { dateString } from 'helpers/date';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChartStats.module.scss';
import { ChartStatsContainerProps } from './ChartStatsContainer';
import ChartStatsPointsLinks from './ChartStatsPointsLinks';

interface ChartStatsProps extends Pick<ChartStatsContainerProps, 'onClose' | 'points'> {
	activePoint: string;
	onChangePoint: (nextPoint: string) => void;
	statistics: ChartDataPointStatistics | null;
	from: number;
	to: number;
}

const ChartStats: React.FC<ChartStatsProps> = ({ onClose, points, onChangePoint, activePoint, from, to, statistics }) => {
	const { t } = useTranslation();
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Typography>{t('data.statistics')}</Typography>
				<ChartStatsPointsLinks points={points} onChange={onChangePoint} active={activePoint} />
				<Zoom in={true} timeout={100}>
					<IconButton size='small' className={styles.closeButton} color='default' onClick={onClose}>
						<CloseOutlined />
					</IconButton>
				</Zoom>
			</div>
			{statistics && <ChartStatsParams {...{ statistics, from, to }} />}
		</div>
	);
};

const ChartStatsParams: React.FC<{ statistics: ChartDataPointStatistics; from: number; to: number }> = ({ statistics, from, to }) => {
	const { min, max, avg, count, countAll } = statistics;
	const { t } = useTranslation();

	const fromDate = dateString(from);
	const toDate = dateString(to);

	return (
		<div className={styles.content}>
			<Params className={styles.params}>
				<Param label={t('data.date_from')} value={fromDate} icon={DateRangeOutlined} />
				<Param label={t('data.date_to')} value={toDate} icon={DateRangeOutlined} />
			</Params>
			<Params className={styles.params}>
				<Param label={t('data.stats.count')} value={count} icon={DataUsageOutlined} />
				<Param label={t('data.stats.countAll')} value={countAll} icon={DataUsageOutlined} />
			</Params>
			<Params className={styles.params}>
				<Param label={t('data.stats.min')} value={(min || 0).toFixed(2)} icon={TimelineOutlined} />
				<Param label={t('data.stats.max')} value={(max || 0).toFixed(2)} icon={TimelineOutlined} />
				<Param label={t('data.stats.avg')} value={(avg || 0).toFixed(2)} icon={TimelineOutlined} />
			</Params>
		</div>
	);
};

export default ChartStats;
