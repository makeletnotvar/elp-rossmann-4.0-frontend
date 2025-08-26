import { ReportProblemOutlined } from '@mui/icons-material';
import cn from 'classnames';
import VertIconsListItem from 'modules/common/components/Lists/VertIconsList/VertIconsListItem';
import { getPriorityClassName } from 'modules/events_v2/helpers/eventsV2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingMenuEventsIcon.module.scss';

interface BuildingMenuEventsIconViewProps {
	onClick: () => void;
	alarmsCount: number;
	alarmsMaxPriority: EventPriority;
	active: boolean;
}

const BuildingMenuEventsIconView: React.FC<BuildingMenuEventsIconViewProps> = ({ onClick, alarmsCount, alarmsMaxPriority, active }) => {
	const { t } = useTranslation();

	const translatedMaxPriority = t(`events.params.priority_values.${alarmsMaxPriority}`);
	const title = t(`events.messages.events_count_details`, { count: alarmsCount, maxPriority: translatedMaxPriority });

	const isAlarmsActive = alarmsCount > 0;
	const priorityClassName = isAlarmsActive ? getPriorityClassName(alarmsMaxPriority, styles) : false;

	const classNames = cn(styles.icon, {
		[styles.active]: isAlarmsActive,
		[styles.inactive]: !isAlarmsActive,
		priorityClassName: priorityClassName,
	});

	return (
		<VertIconsListItem
			icon={ReportProblemOutlined}
			badge={alarmsCount > 0 ? alarmsCount.toString() : undefined}
			title={title}
			onClick={onClick}
			active={active}
			className={classNames}
			alarmsMaxPriority={alarmsMaxPriority}
			index={5}
		/>
	);
};

export default BuildingMenuEventsIconView;
