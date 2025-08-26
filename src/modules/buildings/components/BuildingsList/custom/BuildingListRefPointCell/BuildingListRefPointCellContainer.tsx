import { CircularProgress } from '@mui/material';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import BuildingListRefPointCell from './BuildingListRefPointCell';
import { useBuildingRefPointValue } from './BuildingListRefPointCellHooks';

const BuildingListRefPointCellContainer: React.FC<SuperTableCustomCellProps<any, Building>> = ({ row, columnName }) => {
	const { value, ts, fetching, type } = useBuildingRefPointValue(columnName, row);

	return (
		<>
			{value && value !== '--' ? (
				<BuildingListRefPointCell value={value} type={type} ts={ts} />
			) : fetching ? (
				<CircularProgress color='primary' size={12} />
			) : (
				'-'
			)}
		</>
	);
};

export default BuildingListRefPointCellContainer;
