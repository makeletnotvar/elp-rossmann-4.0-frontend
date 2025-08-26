import { EqualizerOutlined, ScatterPlotOutlined, ScheduleOutlined } from '@mui/icons-material';
import { formatDuration } from 'helpers/date';
import EventsV2Param from 'modules/events_v2/components/EventsV2Param/EventsV2Param';
import { ElpEventV2Stats } from 'modules/events_v2/interfaces/eventV2-stats.interface';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventV2DetailsHistory.module.scss';

interface EventV2DetailsHistoryViewProps {
	event: ElpEventV2Stats;
}

const EventV2DetailsHistoryView: React.FC<EventV2DetailsHistoryViewProps> = ({ event }) => {
	const { t } = useTranslation();
	const averageWeekly = event && event.occurrences && event.occurrences.averageWeekly ? parseFloat(String(event.occurrences.averageWeekly)).toFixed(1) : 0;
	const averageMonthly = event && event.occurrences && event.occurrences.averageMonthly ? parseFloat(String(event.occurrences.averageMonthly)).toFixed(1) : 0;

	return (
		<div style={{ padding: 10 }}>
			<h4 className={styles.historyHeader}>
				<EqualizerOutlined fontSize='inherit' style={{ marginRight: 5, fontSize: '0.75rem' }} />
				{t('events.params.statistic')}
			</h4>
			<div className={styles.historyContainer}>
				<EventsV2Param
					label={t(`events.params.timeSinceLastOccurrenceInMinutes`)}
					value={formatDuration(event?.timeSinceLastOccurrenceInMinutes)?.value}
					unitValue={formatDuration(event?.timeSinceLastOccurrenceInMinutes)?.unit}
					secondValue={formatDuration(event?.timeSinceLastOccurrenceInMinutes)?.secondValue}
					secondUnitValue={formatDuration(event?.timeSinceLastOccurrenceInMinutes)?.secondUnit}
				/>
				<EventsV2Param label={t(`events.params.occurrences.total`)} value={event?.occurrences?.total} />
			</div>
			<h4 className={styles.historyHeader}>
				<ScatterPlotOutlined fontSize='inherit' style={{ marginRight: 5, fontSize: '0.75rem' }} />
				{t('events.params.count')}
			</h4>
			<div className={styles.historyContainer}>
				<EventsV2Param label={t(`events.params.occurrences.lastWeek`)} value={event?.occurrences?.lastWeek} />
				<EventsV2Param label={t(`events.params.occurrences.lastMonth`)} value={event?.occurrences?.lastMonth} />
				<EventsV2Param label={t(`events.params.occurrences.lastYear`)} value={event?.occurrences?.lastYear} />
			</div>
			<div className={styles.historyContainer}>
				<EventsV2Param label={t(`events.params.occurrences.averageWeekly`)} value={averageWeekly} />
				<EventsV2Param label={t(`events.params.occurrences.averageMonthly`)} value={averageMonthly} />
			</div>
			<h4 className={styles.historyHeader}>
				<ScheduleOutlined fontSize='inherit' style={{ marginRight: 5, fontSize: '0.75rem' }} />
				{t('events.params.duration')}
			</h4>
			<div className={styles.historyContainer}>
				<EventsV2Param
					label={t(`events.params.durations.average`)}
					value={formatDuration(event?.durations?.average, 2)?.value}
					unitValue={formatDuration(event?.durations?.average, 2)?.unit}
					secondValue={formatDuration(event?.durations?.average, 2)?.secondValue}
					secondUnitValue={formatDuration(event?.durations?.average, 2)?.secondUnit}
				/>
				<EventsV2Param
					label={t(`events.params.totalDurationInMinutes`)}
					value={formatDuration(event?.totalDurationInMinutes)?.value}
					unitValue={formatDuration(event?.totalDurationInMinutes)?.unit}
					secondValue={formatDuration(event?.totalDurationInMinutes, 2)?.secondValue}
					secondUnitValue={formatDuration(event?.totalDurationInMinutes, 2)?.secondUnit}
				/>
				<EventsV2Param
					label={t(`events.params.durations.longest.duration`)}
					value={formatDuration(event?.durations?.longest?.duration)?.value}
					unitValue={formatDuration(event?.durations?.longest?.duration)?.unit}
					secondValue={formatDuration(event?.durations?.longest?.duration)?.secondValue}
					secondUnitValue={formatDuration(event?.durations?.longest?.duration)?.secondUnit}
					details={
						event?.durations?.longest?.start &&
						event?.durations?.longest?.end &&
						`Od ${moment(event?.durations?.longest?.start).format('lll')} do ${moment(event?.durations?.longest?.end).format('lll')}`
					}
				/>
				<EventsV2Param
					label={t(`events.params.durations.shortest.duration`)}
					value={event?.durations?.shortest?.duration || event?.durations?.shortest?.duration === 0 ? event?.durations?.shortest?.duration : null}
					unitValue='min'
					details={
						event?.durations?.shortest?.start &&
						event?.durations?.shortest?.end &&
						`Od ${moment(event?.durations?.shortest?.start).format('lll')} do ${moment(event?.durations?.shortest?.end).format('lll')}`
					}
				/>
			</div>
		</div>
	);
};

export default EventV2DetailsHistoryView;
