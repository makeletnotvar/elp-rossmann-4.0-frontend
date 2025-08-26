import {
	ChangeHistoryOutlined,
	CheckOutlined,
	DateRangeOutlined,
	FiberManualRecordOutlined,
	HomeOutlined,
	LabelImportantOutlined,
	LabelOutlined,
	PriorityHighOutlined,
} from '@mui/icons-material';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import cn from 'classnames';
import { dateString } from 'helpers/date';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import CustomDialog from 'modules/common/components/Dialogs/CustomDialog/CustomDialog';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventDetails.module.scss';

interface EventDetailsProps {
	event: ElpEvent;
	onClose: () => void;
}

/**
 *
 * EVENT DETAILS
 *
 */
const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const mobileSize = useMediaQuery(theme.breakpoints.down('sm'));
	const { name, type, priority, activeTs, deactiveTs, isActive, acknowledgeTs, acknowledgeUser, acknowledgeable, acknowledged } = event;

	return (
		<CustomDialog
			open
			style={{ height: 200 }}
			customTitle={
				<Box style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					<Typography variant='h6' style={{ fontSize: mobileSize ? '0.875rem' : '1.25rem', fontWeight: 400 }}>
						{name}
					</Typography>
				</Box>
			}
			maxWidth='lg'
			onClose={onClose}
			dialogActions={
				<ConfirmButton noSubmit onClick={onClose}>
					{t('general.ok')}
				</ConfirmButton>
			}
		>
			<EventDetailsGeneral {...{ type, priority, name }} />
			<EventDetailsActive {...{ isActive, activeTs, deactiveTs }} />
			<EventDetailsAcknowledge {...{ acknowledgeTs, acknowledgeUser, acknowledgeable, acknowledged }} />
		</CustomDialog>
	);
};

/**
 *
 * EVENT GENERAL
 *
 */
interface EventDetailsGeneralProps extends Pick<ElpEvent, 'priority' | 'type' | 'name' | 'building'> {}

const EventDetailsGeneral: React.FC<EventDetailsGeneralProps> = ({ priority, type, name, building }) => {
	const { t } = useTranslation();
	const translatedPriority = t(`events.params.priority_values.${priority}`).toUpperCase();
	const translatedType = t(`events.params.type_values.${type}`).toUpperCase();
	const buildingLabel = building ? building.name : '-';

	return (
		<Params wrapperClassName={styles.wrapper} className={styles.params}>
			<Param label={t('events.params.name')} value={name} pure className={styles.param} icon={LabelOutlined} />
			<Param label={t('events.params.type')} value={translatedType} pure className={styles.param} icon={ChangeHistoryOutlined} />
			<Param label={t('events.params.priority')} value={translatedPriority} pure className={styles.param} icon={PriorityHighOutlined} />
			<Param
				label={t('events.params.building')}
				value={buildingLabel}
				pure
				icon={HomeOutlined}
				className={cn(styles.param, { [styles.inactive]: !building })}
			/>
		</Params>
	);
};

/**
 *
 * EVENT ACTIVITY
 *
 */
interface EventDetailsActiveProps extends Pick<ElpEvent, 'isActive' | 'activeTs' | 'deactiveTs'> {}

const EventDetailsActive: React.FC<EventDetailsActiveProps> = ({ isActive, activeTs, deactiveTs }) => {
	const { t } = useTranslation();
	const translatedActive = t(`general.${isActive ? 'active' : 'inactive'}`).toUpperCase();

	return (
		<Params wrapperClassName={styles.wrapper} className={styles.params}>
			<Param label={t('events.params.active')} value={translatedActive} pure className={styles.param} icon={LabelImportantOutlined} />
			<Param label={t('events.params.activeTime')} pure className={styles.param} value={dateString(activeTs)} icon={DateRangeOutlined} />
			<Param
				label={t('events.params.deactiveTime')}
				pure
				className={styles.param}
				value={deactiveTs > 0 ? dateString(deactiveTs) : '--'}
				icon={DateRangeOutlined}
			/>
		</Params>
	);
};

/**
 *
 * EVENT ACKNOWLEDGE
 *
 */
interface EventDetailsAcknowledgeProps extends Pick<ElpEvent, 'acknowledgeable' | 'acknowledged' | 'acknowledgeUser' | 'acknowledgeTs'> {}

const EventDetailsAcknowledge: React.FC<EventDetailsAcknowledgeProps> = ({ acknowledged, acknowledgeable, acknowledgeUser, acknowledgeTs }) => {
	const { t } = useTranslation();
	const translatedAcknowledgeable = t(`general.${acknowledgeable ? 'yes' : 'no'}`).toUpperCase();
	const translatedAcknowledged = t(`general.${acknowledged ? 'yes' : 'no'}`).toUpperCase();

	const acknowledgeTimeLabel = acknowledged && acknowledgeTs && acknowledgeUser ? dateString(acknowledgeTs) : '-';

	const acknowledgeUserLabel = acknowledged && acknowledgeTs && acknowledgeUser ? acknowledgeUser : '-';

	return (
		<Params wrapperClassName={styles.wrapper} className={styles.params}>
			<Param label={t('events.params.acknowledgeable')} pure className={styles.param} value={translatedAcknowledgeable} icon={FiberManualRecordOutlined} />
			<Param
				label={t('events.params.acknowledged')}
				pure
				className={cn(styles.param, { [styles.inactive]: !acknowledged })}
				value={translatedAcknowledged}
				icon={CheckOutlined}
			/>
			<Param
				label={t('events.params.acknowledgeTime')}
				pure
				className={cn(styles.param, { [styles.inactive]: !acknowledged })}
				value={acknowledgeTimeLabel}
				icon={DateRangeOutlined}
			/>
			<Param
				label={t('events.params.acknowledgeUser')}
				pure
				className={cn(styles.param, { [styles.inactive]: !acknowledged })}
				value={acknowledgeUserLabel}
				icon={DateRangeOutlined}
			/>
		</Params>
	);
};

export default EventDetails;
