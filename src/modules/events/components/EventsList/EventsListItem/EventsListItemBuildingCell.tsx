import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { Link } from 'react-router-dom';

const EventsListItemBuildingCell: React.FunctionComponent<SuperTableCustomCellProps<Reference>> = ({ value, row }) => {
	return <>{value ? <Link to={`/building/${value.uuid}/info`}>{value.name}</Link> : '---'}</>;
};

export default EventsListItemBuildingCell;
