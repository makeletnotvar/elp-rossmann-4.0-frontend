import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import { SuperTableDataColumn, SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import SuperTableHeadCell from 'modules/common/components/Layout/SuperTable/cells/SuperTableHeadCell';
import * as React from 'react';
// const styles = require("./SuperTableHead.scss");

interface SuperTableHeadProps {
	checkable?: boolean;
	sortable?: boolean;
	columns: SuperTableDataColumns;
	sortingDir: 'asc' | 'desc';
	sortingParam: string;
	withActions: boolean;
	setSorting: (param: string, dir: 'asc' | 'desc') => void;
	activeFilterColumns: string[];
	translator?: any;
}

const SuperTableHead: React.FC<SuperTableHeadProps> = ({
	columns,
	sortable = false,
	checkable,
	sortingDir,
	sortingParam,
	setSorting,
	withActions,
	activeFilterColumns,
	translator,
}) => {
	const sortClickHandler = (param: string, config: SuperTableDataColumn) => (dir: 'asc' | 'desc') => {
		const sortingParamName = config.forceSortingParamName || param;
		const prefixedSortingParamName: string = (config.sortingParamNamePrefix || '') + sortingParamName;
		setSorting(prefixedSortingParamName, dir);
	};

	return (
		<TableHead style={{ background: '#ddd' }}>
			<TableRow>
				{checkable && <SuperTableHeadCheckboxCell />}
				{Object.entries(columns)
					.filter(([columnName, columnConfig]: [string, SuperTableDataColumn]) => !columnConfig.hidden)
					.map(([columnName, columnConfig]: [string, SuperTableDataColumn]) => {
						const isSortingActive = sortingParam === columnName || sortingParam === `xid_${columnName}`;
						const hasActiveFilter = activeFilterColumns.includes(columnName);
						return (
							<SuperTableHeadCell
								key={columnName}
								hasActiveFilter={hasActiveFilter}
								column={columnConfig}
								sortable={sortable}
								dir={sortingDir}
								isSortingActive={isSortingActive}
								onSortClick={sortClickHandler(columnName, columnConfig)}
								translator={translator}
							/>
						);
					})}
				{withActions && <TableCell align='center'>Akcje</TableCell>}
			</TableRow>
		</TableHead>
	);
};

const SuperTableHeadCheckboxCell = () => {
	return (
		<TableCell padding='checkbox'>
			<Checkbox checked={false} inputProps={{ 'aria-labelledby': 'Zaznacz wszystkie' }} />
		</TableCell>
	);
};

export default SuperTableHead;
