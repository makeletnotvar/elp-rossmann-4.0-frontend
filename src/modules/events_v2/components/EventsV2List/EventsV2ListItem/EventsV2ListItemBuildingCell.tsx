import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsV2ListItemCell.module.scss';

const EventsV2ListItemBuildingCell: React.FunctionComponent<SuperTableCustomCellProps<Reference>> = ({ value }) => {
	return value && value?.uuid ? (
		<Link className={styles.buildingLink} to={`/building/${value.uuid}/info`}>
			{value.name}
		</Link>
	) : null;
};

export default EventsV2ListItemBuildingCell;
