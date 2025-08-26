import { CheckOutlined } from '@mui/icons-material';
import { Chip, CircularProgress, IconButton, Tooltip, Zoom } from '@mui/material';
import { dateString } from 'helpers/date';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useEventV2Acknowledge } from 'modules/events_v2/hooks/useEventV2Acknowledge';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import { EventV2Type } from 'modules/events_v2/types/eventV2-type.type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2ListItemCell.module.scss';

const EventsV2ListItemAcknowledgeCell: React.FunctionComponent<SuperTableCustomCellProps<EventV2Type, ElpEventV2>> = ({ row }) => {
	const { acknowledgeable, acknowledged, acknowledgeTs, acknowledgeUser, uuid } = row as ElpEventV2;
	const { acknowledgeHandler, acknowledging } = useEventV2Acknowledge(uuid);

	return (
		<div style={{ position: 'relative', width: 100 }}>
			{acknowledgeable ? (
				acknowledged ? (
					<AcknowledgedLabel {...{ acknowledgeTs, acknowledgeUser }} />
				) : acknowledging ? (
					<AcknowledgeFetching />
				) : (
					<AcknowledgeButton onClick={acknowledgeHandler} />
				)
			) : (
				'-'
			)}
		</div>
	);
};

const AcknowledgeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
	<IconButton {...{ onClick }} size='small'>
		<CheckOutlined fontSize='inherit' />
	</IconButton>
);

const AcknowledgedLabel: React.FC<Pick<ElpEventV2, 'acknowledgeTs' | 'acknowledgeUser'>> = ({ acknowledgeTs, acknowledgeUser }) => {
	const tooltipText = (
		<>
			Zresetowany {dateString(acknowledgeTs || 0)}
			<br />
			<u>{`${acknowledgeUser}`}</u>
		</>
	);

	return (
		<Zoom in={true}>
			<Tooltip title={tooltipText}>
				<Chip label={`${acknowledgeUser}`} icon={<CheckOutlined fontSize='small' />} size='small' color='primary' className={styles.acknowledge} />
			</Tooltip>
		</Zoom>
	);
};

const AcknowledgeFetching = () => {
	const { t } = useTranslation();

	return (
		<div className={styles.loading}>
			<CircularProgress size={16} color='primary' />
			<label>{t('events.params.acknowledging')}</label>
		</div>
	);
};

export default EventsV2ListItemAcknowledgeCell;
