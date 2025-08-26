import { Skeleton, Table, TableBody } from '@mui/material';
import cn from 'classnames';
import { UI } from 'config/ui';
import { nArray } from 'helpers/data';
import { isArray } from 'lodash';
import SuperTablePagination from 'modules/common/components/Layout/SuperTable/SuperTablePagination';
import SuperTableRow from 'modules/common/components/Layout/SuperTable/SuperTableRow';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SuperTable.module.scss';
import SuperTableHead from './SuperTableHead';

export interface SuperTableData {
	[identifier: string]: any;
}

export interface SuperTableCustomCellProps<T = any, S = any> {
	value: T;
	row?: S;
	columnName?: string;
	index?: number;
}
export interface SuperTableDataColumn {
	label: string;
	translateLabel?: boolean;
	disabledSorting?: boolean;
	disabledHide?: boolean;
	hidden?: boolean;
	custom?: React.FunctionComponent<SuperTableCustomCellProps>; // custom component
	align?: 'left' | 'right' | 'center';
	async?: boolean;
	searchable?: boolean; // using for highlight search query in words
	translationPrefix?: string; // translate value with path (provided as prefix) -> i.e. value string 'a' with translation path "some.path" -> returns translated 'some.path.a" path
	tdClassName?: string | undefined; // add class name to <td>
	thClassName?: string | undefined; // add class name to <th>
	ref?: boolean; // value using for display ref point params
	title?: string; // tooltip title
	unit?: string;
	shortName?: string;
	group?: string;
	groupName?: string;
	forceSortingParamName?: string; // force sorting param name
	sortingParamNamePrefix?: string; // prefix for sorting param
	sticky?: 'always' | 'small';
	onClick?: (value: number | string, row: any) => void;
}

export type SuperTableDataColumns<T = any, S = any> = {
	[param: string]: SuperTableDataColumn;
};

interface SuperTableProps {
	label?: string;
	data: SuperTableData[];
	fetching?: boolean;
	columns: SuperTableDataColumns;
	className?: string;
	wrapperClassName?: string;
	paginationClassName?: string;
	configurable?: boolean;
	searchable?: boolean;
	filterable?: boolean;
	sortable?: boolean;
	sortingDir?: 'asc' | 'desc';
	sortingParam?: string;
	checkable?: boolean;
	hideHeaders?: boolean;
	activeFilterColumns?: string[];
	query?: string;
	pagination?: boolean;
	rowsPerPage?: number;
	offset?: number;
	count?: number;
	translator?: any;
	// no results search message
	noResults?: boolean;
	hidePagination?: boolean;
	rowClassName?: (rowData: any) => string;
	onUpdateSettings?: (ob: Partial<SuperTableDisplaySettings>) => void;
	rowActions?: (rowData: any, index: number) => React.ReactElement<any>;
	footer?: any;
}

export interface SuperTableDisplaySettings {
	sorting: boolean;
	sortingParam: string;
	sortingDir: 'asc' | 'desc';
	page: number;
	offset: number;
	rowsPerPage: number;
	query: string;
	columns: string[];
}

const SuperTable: React.FC<SuperTableProps> = ({
	label = '',
	columns,
	data = [],
	sortingDir: sortingDefaultDir,
	sortingParam: sortingDefaultParam,
	className = '',
	wrapperClassName = '',
	paginationClassName = '',
	query = '',
	configurable = false,
	searchable = false,
	filterable = false,

	sortable = false,
	checkable = false,
	hideHeaders = false,
	pagination = false,
	rowsPerPage = UI.TABLES.ROWS_PER_PAGE_DEFAULT_SELECTED,
	count = 0,
	fetching = false,
	activeFilterColumns = [],

	offset = 0,
	onUpdateSettings,
	translator,
	rowActions,
	hidePagination = false,
	rowClassName,
	noResults,
	footer = null,
}) => {
	const { t } = useTranslation();
	const param = sortingDefaultParam || 'name';
	const dir = sortingDefaultDir || 'asc';

	const updateSortingHandler = (sortingParam: string, sortingDir: 'asc' | 'desc') => {
		onUpdateSettings && onUpdateSettings({ sortingParam, sortingDir });
	};

	const updatePaginationHandler = (offset: number, rowsPerPage: number) => {
		onUpdateSettings && onUpdateSettings({ offset, rowsPerPage });
	};

	return (
		<>
			<div className={cn(wrapperClassName, styles.wrapper, { [styles.fetching]: fetching, [styles.pagination]: hidePagination })}>
				<Table className={cn(styles.table, className)} stickyHeader>
					{!hideHeaders && (
						<SuperTableHead
							{...{
								translator,
								columns,
								activeFilterColumns,
								checkable,
								sortable,
								sortingDir: dir,
								sortingParam: param,
								setSorting: updateSortingHandler,
								withActions: !!rowActions,
							}}
						/>
					)}
					<TableBody>
						{!fetching &&
							(isArray(data) ? data : []).map((rowData, index) => (
								<SuperTableRow
									rowClassName={rowClassName}
									key={(rowData.uuid || Object.values(rowData)[0]) + index}
									rowIndex={index}
									{...{
										checkable,
										query,
										columns,
										rowData,
										rowActions,
									}}
								/>
							))}
					</TableBody>
				</Table>
				{noResults && query ? (
					<div className={styles.noResultsSearch}>
						<label>{t('general.messages.search_no_results')}</label>
						<strong>{query}</strong>
					</div>
				) : (
					(data.length <= 0 || fetching) && (
						<>
							{!fetching ? (
								<div className={styles.noResults}></div>
							) : (
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									{nArray(20).map(index => (
										<Skeleton
											key={index}
											style={{ width: '100%', height: '36.8px', minHeight: '36.8px', maxHeight: '36.8px', transform: 'scale(1, 0.95)', opacity: 0.25 }}
										/>
									))}
								</div>
							)}
						</>
					)
				)}
			</div>
			{!hidePagination && (
				<SuperTablePagination
					paginationClassName={paginationClassName}
					buttonsDisabled={fetching}
					page={offset}
					count={count}
					rowsPerPage={rowsPerPage}
					onUpdate={updatePaginationHandler}
				/>
			)}
			{footer && footer}
		</>
	);
};

export default SuperTable;
