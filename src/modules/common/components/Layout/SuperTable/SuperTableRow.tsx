import { TableCell, TableRow } from '@mui/material';
import { SuperTableData, SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import SuperTableCheckboxCell from 'modules/common/components/Layout/SuperTable/SuperTableCheckboxCell';
import SuperTableRowCell from 'modules/common/components/Layout/SuperTable/cells/SuperTableRowCell';
import * as React from 'react';
import styles from './SuperTable.module.scss';

interface SuperTableRowProps {
	checkable?: boolean;
	rowData: SuperTableData;
	rowActions?: (rowData: any, index: number) => React.ReactElement<any>;
	columns: SuperTableDataColumns;
	query: string;
	rowClassName?: (rowData: any) => string;
	rowIndex: number;
}

const SuperTableRow: React.FC<SuperTableRowProps> = ({ checkable, columns, rowData, rowActions, query, rowClassName, rowIndex }) => {
	return (
		<TableRow className={rowClassName ? rowClassName(rowData) : styles.row}>
			{checkable && <SuperTableCheckboxCell />}
			{Object.keys(columns)
				.filter(column => !columns[column]!.hidden)
				.map(columnName => (
					<SuperTableRowCell
						key={columnName}
						{...{
							columns,
							query,
							columnName,
							rowData,
							rowIndex,
							className: columns[columnName] ? columns[columnName]!.tdClassName || undefined : undefined,
						}}
					/>
				))}
			{rowActions && (
				<TableCell align='center' padding='checkbox'>
					{rowActions(rowData, rowIndex)}
				</TableCell>
			)}
		</TableRow>
	);
};

export default SuperTableRow;
