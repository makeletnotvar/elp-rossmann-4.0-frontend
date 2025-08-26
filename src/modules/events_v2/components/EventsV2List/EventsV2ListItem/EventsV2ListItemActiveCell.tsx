import { ClearOutlined, ErrorOutlined } from '@mui/icons-material';
import { Chip, Zoom } from '@mui/material';
import cn from 'classnames';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { EventV2Priority } from 'modules/events_v2/types/eventV2-priority.type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2ListItemCell.module.scss';

const EventsV2ListItemActiveCell: React.FunctionComponent<SuperTableCustomCellProps<EventV2Priority>> = ({ value }) => {
	const { t } = useTranslation();
	const label = value ? t('general.active') : t('general.inactive');

	return (
		<Zoom in={true}>
			<Chip label={label} size='small' icon={value ? <ErrorOutlined /> : <ClearOutlined />} className={cn(styles.status, { [styles.active]: value })} />
		</Zoom>
	);
};

export default EventsV2ListItemActiveCell;
