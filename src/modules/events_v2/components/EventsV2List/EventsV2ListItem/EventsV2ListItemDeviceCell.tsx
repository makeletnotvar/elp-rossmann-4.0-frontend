import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';

const EventsV2ListItemDeviceCell: React.FunctionComponent<SuperTableCustomCellProps<Reference>> = ({ value }) => {
	return <>{value ? <>{value.name}</> : '---'}</>;
};

export default EventsV2ListItemDeviceCell;
