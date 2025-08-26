import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsV2ListItemCell.module.scss';

const EventsV2ListItemNameCell: React.FunctionComponent<SuperTableCustomCellProps & { tab: 'active' | 'history' }> = ({ value, row, tab }) => {
	return value && row?.uuid ? (
		<Link className={styles.nameLink} to={`/events-v2/${tab}/${row?.uuid}`}>
			{value}
		</Link>
	) : null;
};

export default EventsV2ListItemNameCell;
