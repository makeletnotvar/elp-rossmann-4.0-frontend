import { CheckOutlined, HomeOutlined, ScheduleOutlined } from '@mui/icons-material';
import { formatDuration } from 'helpers/date';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import EventsV2Param from 'modules/events_v2/components/EventsV2Param/EventsV2Param';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import { ElpEventV2Instance } from 'modules/events_v2/interfaces/eventV2-instance.interface';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventV2DetailsInstance.module.scss';

interface EventV2DetailsInstanceViewProps {
	event: ElpEventV2Instance;
	tab: 'active' | 'history';
}

const EventV2DetailsInstanceView: React.FC<EventV2DetailsInstanceViewProps> = ({ event, tab }) => {
	const { t } = useTranslation();
	return (
		<div style={{ padding: 10 }}>
			<h4 className={styles.instanceHeader}>
				<HomeOutlined fontSize='inherit' style={{ marginRight: 2 }} />
				{t('events.params.info')}
			</h4>
			<div className={styles.instanceContainer}>
				<EventsV2Param label={t(`events.params.building`)} link={`/building/${event?.building?.uuid}/info`} value={event?.building?.name} />
				<AuthDev>
					<EventsV2Param label={t(`events.params.device`)} link={`/device/${event?.device?.uuid}/info`} value={event?.device?.name} />
					{event?.unitXid && (
						<EventsV2Param label={t(`events.params.unitXid`)} link={`/building/${event?.building?.uuid}/units/${event?.unitXid}`} value={event?.unitName} />
					)}
				</AuthDev>
				{event?.priority && (
					<EventsV2Param label={t(`events.params.priority`)} value={t(`events.params.priority_values.${getEventsPriorityName(event?.priority)}`)} />
				)}
				<EventsV2Param label={t(`events.params.status`)} value={event?.isActive ? t('general.active') : t('general.inactive')} />
			</div>
			<h4 className={styles.instanceHeader}>
				<ScheduleOutlined fontSize='inherit' style={{ marginRight: 5, fontSize: '0.75rem' }} />
				{t('events.params.time')}
			</h4>
			<div className={styles.instanceContainer}>
				<EventsV2Param label={t(`events.params.start`)} value={event?.start ? moment(event?.start).format('lll') : null} />
				{event?.end && tab === 'history' && <EventsV2Param label={t(`events.params.end`)} value={event?.end ? moment(event?.end).format('lll') : null} />}
				<AuthDev>
					{event?.deviceTime && (
						<EventsV2Param label={t(`events.params.deviceTime`)} value={event?.deviceTime ? moment(event?.deviceTime).format('lll') : null} />
					)}
				</AuthDev>
				<EventsV2Param
					label={t(`events.params.durationInMinutes`)}
					value={formatDuration(event?.durationInMinutes)?.value}
					unitValue={formatDuration(event?.durationInMinutes)?.unit}
					secondValue={formatDuration(event?.durationInMinutes)?.secondValue}
					secondUnitValue={formatDuration(event?.durationInMinutes)?.secondUnit}
				/>
			</div>
			{event?.acknowledge && (
				<>
					<h4 className={styles.instanceHeader}>
						<CheckOutlined fontSize='inherit' style={{ marginRight: 5, fontSize: '0.75rem' }} />
						{t('events.params.acknowledge')}
					</h4>
					<div className={styles.instanceContainer}>
						<EventsV2Param label={t(`events.params.acknowledgeUser`)} value={event?.acknowledge?.user} />
						<EventsV2Param
							label={t(`events.params.acknowledgeTime`)}
							value={event?.acknowledge.datetime ? moment(event?.acknowledge.datetime).format('lll') : null}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default EventV2DetailsInstanceView;
