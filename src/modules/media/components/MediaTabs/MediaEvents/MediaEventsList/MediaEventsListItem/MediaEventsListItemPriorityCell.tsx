import { ReportProblemOutlined } from '@mui/icons-material';
import { Badge, Tooltip, Zoom } from '@mui/material';
import cn from 'classnames';
import { capitalize } from 'lodash';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MediaEventsListItemCell.module.scss';

interface MediaEventsListItemPriorityCellProps extends SuperTableCustomCellProps<EventPriority> {
	label?: string;
	title?: string;
	count?: number;
}

const MediaEventsListItemPriorityCell: React.FunctionComponent<MediaEventsListItemPriorityCellProps> = props => {
	const { value, title, count, row } = props;
	const { t } = useTranslation();

	const autoLabel = capitalize(t(`media.params.priority_values.${value}`));
	const classnames = cn(
		styles.icon,
		{ [styles.isActive]: row !== undefined && row.isActive },

		styles[value.toLowerCase()]
	);

	return (
		<Zoom in={true} timeout={100}>
			<Tooltip title={title || autoLabel} enterDelay={100}>
				<Badge
					overlap='rectangular'
					color='primary'
					badgeContent={count !== undefined ? count : null}
					className={cn(styles.badge, styles[value.toLowerCase()])}
				>
					<ReportProblemOutlined className={classnames} />
				</Badge>
			</Tooltip>
		</Zoom>
	);
};

export default MediaEventsListItemPriorityCell;
