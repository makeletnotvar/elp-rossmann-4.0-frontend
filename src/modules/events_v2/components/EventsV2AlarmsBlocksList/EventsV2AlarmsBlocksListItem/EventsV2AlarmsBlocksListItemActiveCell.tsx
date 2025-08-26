import { ClearOutlined, ErrorOutlined } from '@mui/icons-material';
import { Chip, Tooltip, Zoom } from '@mui/material';
import cn from 'classnames';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { EventV2Priority } from 'modules/events_v2/types/eventV2-priority.type';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2AlarmsBlocksListItemCell.module.scss';

const EventsV2AlarmsBlocksListItemActiveCell: React.FunctionComponent<SuperTableCustomCellProps<EventV2Priority>> = ({ value, row }) => {
	const { t } = useTranslation();
	const label = value ? t('general.active') : t('general.inactive');

	return (
		<Zoom in={true}>
			<Tooltip
				disableHoverListener={!value}
				title={`${t('alarmsblocks.params.activeSience')}
					${(row.lastOccurTs as number) > 0 ? moment(row.lastOccurTs as number).format('YYYY.MM.DD, hh:mm') : '-'}
				`}
				enterDelay={100}
			>
				<Chip label={label} size='small' icon={value ? <ErrorOutlined /> : <ClearOutlined />} className={cn(styles.status, { [styles.active]: value })} />
			</Tooltip>
		</Zoom>
	);
};

export default EventsV2AlarmsBlocksListItemActiveCell;
