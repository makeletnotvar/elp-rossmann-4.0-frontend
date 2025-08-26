import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsV2AlarmsBlocksListItemCell.module.scss';

const EventsV2AlarmsBlocksListItemBuildingCell: React.FunctionComponent<SuperTableCustomCellProps<Reference>> = ({ value, row }) => {
	return value && value.uuid ? (
		<Link className={styles.buildingLink} to={`/building/${value.uuid}/info`}>
			{value.name}
		</Link>
	) : null;
};

export default EventsV2AlarmsBlocksListItemBuildingCell;
