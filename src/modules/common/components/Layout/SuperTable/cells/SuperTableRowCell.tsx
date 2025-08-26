import { TableCell } from '@mui/material';
import cn from 'classnames';
import { AsyncCellValue } from 'modules/common/components/Layout/SuperTable/cells/AsyncCellValue';
import { StaticCellValue } from 'modules/common/components/Layout/SuperTable/cells/StaticCellValue';
import { SuperTableData, SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface SuperTableRowCellProps {
	columns: SuperTableDataColumns;
	columnName: string;
	rowData: SuperTableData;
	query: string;
	className?: string | undefined;
	rowIndex: number;
}

const SuperTableRowCell: React.FC<SuperTableRowCellProps> = ({ columns, columnName, rowData, query, className, rowIndex }) => {
	const { t } = useTranslation();
	const columnConfig = columns[columnName];
	const isAsyncValue = columnConfig.async;
	const CustomCell = columnConfig.custom;
	const align = columnConfig.align || 'left';
	const tempValue = (rowData as any)[columnName];
	const value = typeof tempValue === 'object' && !CustomCell ? (tempValue && tempValue['name'] ? tempValue['name'] : tempValue) : tempValue;
	const translatedValue = columnConfig.translationPrefix ? t(`${columnConfig.translationPrefix}.${value}`) : null;

	/**
	 * Searching marks - only sync params could be 'searchable'
	 */
	const { searchValue } = useMemo(() => {
		if (!columnConfig.searchable || typeof value !== 'string' || !query) return { searchValue: value };
		const words = query
			.slice(0, 32)
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-zA-Z0-9_ąęćńóśźżłĄĘĆŃÓŚŹŻŁ ]/g, '')
			.trim()
			.toLowerCase()
			.split(' ')
			.filter(Boolean);
		const regex = new RegExp(`(${words.join('|')})`, 'gi');

		return {
			searchValue: value.replace(regex, match => `<span class="marked">${match}</span>`),
		};
	}, [columnConfig.searchable, query, value]);

	return (
		<TableCell key={columnName} {...{ align }} className={cn(className)} {...(columnConfig.sticky ? { 'data-sticky': columnConfig.sticky } : '')}>
			{isAsyncValue ? (
				<AsyncCellValue
					rowData={rowData}
					columnName={columnName}
					custom={value => (CustomCell ? <CustomCell value={value} row={rowData} columnName={columnName} index={rowIndex} /> : null)}
					onClick={columnConfig?.onClick}
				/>
			) : (
				<StaticCellValue
					columnName={columnName}
					index={rowIndex}
					customCell={CustomCell}
					translatedValue={translatedValue}
					value={value}
					searchValue={searchValue}
					rowData={rowData}
					onClick={columnConfig?.onClick}
				/>
			)}
		</TableCell>
	);
};

export default SuperTableRowCell;
