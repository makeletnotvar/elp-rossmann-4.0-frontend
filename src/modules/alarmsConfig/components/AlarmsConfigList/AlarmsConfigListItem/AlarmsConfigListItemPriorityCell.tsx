import { Badge, Tooltip } from '@mui/material';
import { ReportProblemOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { capitalize } from 'lodash';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AlarmsConfigListItemCell.module.scss';

interface AlarmsConfigListItemPriorityCellProps extends SuperTableCustomCellProps<EventPriority> {
	label?: string;
	title?: string;
	count?: number;
}

const AlarmsConfigListItemPriorityCell: React.FunctionComponent<AlarmsConfigListItemPriorityCellProps> = props => {
	const { value, title, count, row } = props;
	const { t } = useTranslation();

	const autoLabel = capitalize(t(`alarmsConfig.params.priority_values.${value}`));
	const classnames = cn(
		styles.icon,
		{ [styles.isActive]: row !== undefined && row.isActive },

		styles[value.toLowerCase().split('_').join('')]
	);

	return (
		<div className={styles.container}>
			<Tooltip title={title || autoLabel} enterDelay={100}>
				<Badge overlap='rectangular' color='primary' badgeContent={count !== undefined ? count : null} className={cn(styles.badge)}>
					<ReportProblemOutlined fontSize='inherit' className={classnames} />
				</Badge>
			</Tooltip>
		</div>
	);
};

export default AlarmsConfigListItemPriorityCell;
