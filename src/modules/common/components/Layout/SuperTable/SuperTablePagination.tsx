import { TablePagination } from '@mui/material';
import cn from 'classnames';
import { UI } from 'config/ui';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SuperTable.module.scss';

interface SuperTablePaginationProps {
	page: number;
	count: number;
	rowsPerPage: number;
	rowsPerPageOptions?: number[];
	onUpdate: (page: number, rowsPerPage: number) => void;
	paginationClassName?: string;
	buttonsDisabled?: boolean;
}

const SuperTablePagination: React.FC<SuperTablePaginationProps> = ({
	page,
	count,
	rowsPerPage,
	rowsPerPageOptions,
	onUpdate,
	paginationClassName,
	buttonsDisabled = false,
}) => {
	const [toCount, setToCount] = React.useState<number | null>(null);
	const { t } = useTranslation();

	const { startPage, endPage } = React.useMemo(() => {
		const startPage = 0;
		const endPage = Math.round(count / rowsPerPage);

		return {
			startPage,
			endPage,
		};
	}, [count, rowsPerPage]);

	return (
		<TablePagination
			data-testid='table-pagination'
			className={cn(styles.pagination, paginationClassName)}
			rowsPerPageOptions={rowsPerPageOptions || UI.TABLES.ROWS_PER_PAGE_DEFAULT_OPTIONS}
			component='div'
			count={count}
			rowsPerPage={rowsPerPage}
			labelRowsPerPage={t('general.rows_per_page')}
			labelDisplayedRows={({ from, to, count }) => {
				setToCount(to);
				return t('general.pagination', { from: count <= 0 ? 0 : from, to: count <= 0 ? 0 : to, count: count <= 0 ? 0 : count });
			}}
			page={page}
			backIconButtonProps={{ 'aria-label': 'Previous Page', disabled: buttonsDisabled || page <= startPage }}
			nextIconButtonProps={{ 'aria-label': 'Next Page', disabled: buttonsDisabled || page >= endPage || count === toCount }}
			onPageChange={(evt: unknown, nextPage: number) => onUpdate(nextPage, rowsPerPage)}
			onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => onUpdate(page, +event.target.value)}
		/>
	);
};

export default SuperTablePagination;
