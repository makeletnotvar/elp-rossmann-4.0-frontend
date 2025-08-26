import { CheckOutlined } from '@mui/icons-material';
import { Chip, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { dateString } from 'helpers/date';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { eventsActions } from 'modules/events/redux/events';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsListItemCell.module.scss';

interface EventsListItemAcknowledgeCellProps {}

const useEventAcknowledge = (uuid: string) => {
	const dispatch = useDispatch();
	const [acknowledging, setAcknowledging] = useState<boolean>(false);

	const acknowledgeHandler = useCallback(() => {
		setAcknowledging(true);
		dispatch(eventsActions.acknowledge(uuid)).then(() => setAcknowledging(false));
	}, [uuid]);

	return {
		acknowledgeHandler,
		acknowledging,
	};
};

const EventsListItemAcknowledgeCell: React.FunctionComponent<SuperTableCustomCellProps<EventType, ElpEvent>> = ({ value, row }) => {
	const { acknowledgeable, acknowledged, acknowledgeTs, acknowledgeUser, uuid } = row as ElpEvent;
	const { acknowledgeHandler, acknowledging } = useEventAcknowledge(uuid);

	return (
		<div style={{ position: 'relative' }}>
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
		<CheckOutlined />
	</IconButton>
);

const AcknowledgedLabel: React.FC<Pick<ElpEvent, 'acknowledgeTs' | 'acknowledgeUser'>> = ({ acknowledgeTs, acknowledgeUser }) => {
	return (
		<Tooltip title={dateString(acknowledgeTs || 0)}>
			<Chip label={`${acknowledgeUser}`} icon={<CheckOutlined />} size='small' color='secondary' className={styles.acknowledge} />
		</Tooltip>
	);
};

const AcknowledgeFetching = () => {
	const { t } = useTranslation();

	return (
		<div className={styles.loading}>
			<CircularProgress size={16} color='secondary' />
			<label>{t('events.params.acknowledging')}</label>
		</div>
	);
};

export default EventsListItemAcknowledgeCell;
