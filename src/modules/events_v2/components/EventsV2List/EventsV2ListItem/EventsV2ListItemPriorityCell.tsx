import { ReportProblemOutlined } from '@mui/icons-material';
import { Badge, Tooltip } from '@mui/material';
import cn from 'classnames';
import { capitalize } from 'lodash';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { EventV2Priority } from 'modules/events_v2/types/eventV2-priority.type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2ListItemCell.module.scss';

interface EventsV2ListItemPriorityCellProps extends SuperTableCustomCellProps<EventV2Priority> {
	label?: string;
	title?: string;
	count?: number;
	disabledLink?: boolean;
	icon?: MuiIconType;
}

const EventsV2ListItemPriorityCell: React.FunctionComponent<EventsV2ListItemPriorityCellProps> = props => {
	const { value, title, count, icon, row, disabledLink } = props;

	const { t } = useTranslation();

	const autoLabel = capitalize(t(`events.params.priority_values.${value}`));
	const classnames = cn(
		styles.icon,
		{ [styles.isActive]: row !== undefined && row.isActive },

		styles[value.toLowerCase().split('_').join('')]
	);

	const Icon = icon;

	return (
		<Tooltip title={title || autoLabel} enterDelay={100}>
			<Badge
				overlap='rectangular'
				badgeContent={count !== undefined ? count : null}
				style={{ cursor: disabledLink ? 'default' : 'pointer' }}
				className={cn(styles.badge, styles[value.toLowerCase().split('_').join('')])}
			>
				{Icon ? (
					<Icon style={{ cursor: disabledLink ? 'default' : 'pointer' }} fontSize='inherit' className={classnames} />
				) : (
					<ReportProblemOutlined style={{ cursor: disabledLink ? 'default' : 'pointer' }} fontSize='inherit' className={classnames} />
				)}
			</Badge>
		</Tooltip>
	);
};

export default EventsV2ListItemPriorityCell;
