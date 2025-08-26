import {
	ChangeHistoryOutlined,
	CheckOutlined,
	CloseOutlined,
	DateRangeOutlined,
	DevicesOtherOutlined,
	FiberManualRecordOutlined,
	LabelImportantOutlined,
	LabelOutlined,
	PriorityHighOutlined,
	WarningOutlined,
} from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import cn from 'classnames';
import { dateString } from 'helpers/date';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MediaEventDetails.module.scss';

interface MediaEventDetailsProps {
	mediaEvent: ElpEvent;
	onClose: () => void;
}

/**
 *
 * EVENT DETAILS
 *
 */
const MediaEventDetails: React.FC<MediaEventDetailsProps> = ({ mediaEvent, onClose }) => {
	const { t } = useTranslation();
	const { name, type, device, priority, activeTs, deactiveTs, isActive, acknowledgeTs, acknowledgeUser, acknowledgeable, acknowledged } = mediaEvent;

	return (
		<Dialog open={true} className={styles.dialog} onClose={onClose} maxWidth='lg'>
			<DialogTitle id='alert-dialog-title' className={styles.title}>
				<WarningOutlined style={{ marginRight: 10 }} />
				<label>{name}</label>
				<IconButton className={styles.closeButton} onClick={onClose}>
					<CloseOutlined />
				</IconButton>
			</DialogTitle>
			<DialogContent className={styles.content}>
				<MediaEventDetailsGeneral {...{ device, type, priority, name }} />
				<MediaEventDetailsActive {...{ isActive, activeTs, deactiveTs }} />
				<MediaEventDetailsAcknowledge {...{ acknowledgeTs, acknowledgeUser, acknowledgeable, acknowledged }} />
			</DialogContent>
			<DialogActions>
				<ConfirmButton onClick={onClose} color='primary'>
					Ok
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

/**
 *
 * EVENT GENERAL
 *
 */
interface MediaEventDetailsGeneralProps extends Pick<ElpEvent, 'priority' | 'type' | 'name' | 'device'> {}

const MediaEventDetailsGeneral: React.FC<MediaEventDetailsGeneralProps> = ({ priority, type, name, device }) => {
	const { t } = useTranslation();
	const translatedPriority = t(`events.params.priority_values.${priority}`).toUpperCase();
	const translatedType = t(`events.params.type_values.${type}`).toUpperCase();

	return (
		<Params className={styles.params}>
			<Param label={t('events.params.name')} value={name} pure className={styles.param} icon={LabelOutlined} />
			<Param label={t('events.params.type')} value={translatedType} pure className={styles.param} icon={ChangeHistoryOutlined} />
			<Param label={t('events.params.priority')} value={translatedPriority} pure className={styles.param} icon={PriorityHighOutlined} />
			<Param
				label={t('events.params.device')}
				value={device ? device.name : '--'}
				pure
				icon={DevicesOtherOutlined}
				className={cn(styles.param, { [styles.inactive]: !device })}
			/>
		</Params>
	);
};

/**
 *
 * EVENT ACTIVITY
 *
 */
interface MediaEventDetailsActiveProps extends Pick<ElpEvent, 'isActive' | 'activeTs' | 'deactiveTs'> {}

const MediaEventDetailsActive: React.FC<MediaEventDetailsActiveProps> = ({ isActive, activeTs, deactiveTs }) => {
	const { t } = useTranslation();
	const translatedActive = t(`general.${isActive ? 'active' : 'inactive'}`).toUpperCase();

	return (
		<Params className={styles.params}>
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
interface MediaEventDetailsAcknowledgeProps extends Pick<ElpEvent, 'acknowledgeable' | 'acknowledged' | 'acknowledgeUser' | 'acknowledgeTs'> {}

const MediaEventDetailsAcknowledge: React.FC<MediaEventDetailsAcknowledgeProps> = ({ acknowledged, acknowledgeable, acknowledgeUser, acknowledgeTs }) => {
	const { t } = useTranslation();
	const translatedAcknowledgeable = t(`general.${acknowledgeable ? 'yes' : 'no'}`).toUpperCase();
	const translatedAcknowledged = t(`general.${acknowledged ? 'yes' : 'no'}`).toUpperCase();

	const acknowledgeTimeLabel = acknowledged && acknowledgeTs && acknowledgeUser ? dateString(acknowledgeTs) : '-';

	const acknowledgeUserLabel = acknowledged && acknowledgeTs && acknowledgeUser ? acknowledgeUser : '-';

	return (
		<Params className={styles.params}>
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

export default MediaEventDetails;
