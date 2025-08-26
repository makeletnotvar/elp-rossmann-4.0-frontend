import { ReportProblemOutlined } from '@mui/icons-material';
import { Badge, Tooltip } from '@mui/material';
import cn from 'classnames';
import { capitalize } from 'lodash';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsListItemCell.module.scss';

interface EventsListItemPriorityCellProps extends SuperTableCustomCellProps<EventPriority> {
	label?: string;
	title?: string;
	count?: number;
}

const EventsListItemPriorityCell: React.FunctionComponent<EventsListItemPriorityCellProps> = props => {
	const { value, title, count, row } = props;
	const { t } = useTranslation();

	const autoLabel = capitalize(t(`events.params.priority_values.${value}`));
	const classnames = cn(
		styles.icon,
		{ [styles.isActive]: row !== undefined && row.isActive },

		styles[value.toLowerCase().split('_').join('')]
	);

	return (
		<Tooltip title={title || autoLabel}>
			<Badge
				overlap='rectangular'
				badgeContent={count !== undefined ? count : null}
				className={cn(styles.badge, styles[value.toLowerCase().split('_').join('')])}
			>
				<ReportProblemOutlined className={classnames} />
			</Badge>
		</Tooltip>
	);
};

export default EventsListItemPriorityCell;
