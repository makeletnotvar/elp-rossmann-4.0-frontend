import { FilterListOutlined } from '@mui/icons-material';
import { TableCell, TableSortLabel, Tooltip } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import { CSSProperties } from 'react';
import { SuperTableDataColumn } from '../SuperTable';
import styles from './../SuperTable.module.scss';

interface SuperTableHeadCellProps {
	column: SuperTableDataColumn;
	sortable: boolean;
	isSortingActive?: boolean;
	dir: 'asc' | 'desc';
	onSortClick: (dir: 'asc' | 'desc') => void;
	hasActiveFilter: boolean;
	translator?: any;
}

const SuperTableHeadCell: React.FC<SuperTableHeadCellProps> = ({ sortable, hasActiveFilter, column, dir, isSortingActive, onSortClick, translator }) => {
	const { label, title: definiedTitle, shortName, unit, thClassName } = column;
	const withSorting = sortable && !column.disabledSorting;

	let translatedLabel = label;

	try {
		translatedLabel = translator ? translator(label) : label;
	} catch (e) {
		//
	}

	const Label = ({ style }: { style?: CSSProperties }) => (
		<>
			<label style={{ ...style }}>{translatedLabel}</label>
			{unit ? <b> {unit}</b> : ''}
		</>
	);

	const className = cn(thClassName, {
		[styles.shortHeader]: shortName,
	});

	const title = definiedTitle || translatedLabel;

	return (
		<TableCell
			style={{ backgroundColor: '#f9f9f9', paddingLeft: column.align === 'center' && withSorting ? '35px' : 10 }}
			key={column.label}
			align={column.align || 'left'}
			className={className}
			{...(column.sticky ? { 'data-sticky': column.sticky } : '')}
		>
			{hasActiveFilter && (
				<FilterListOutlined
					style={{
						width: 16,
						height: 16,
						position: 'relative',
						top: 5,
						marginRight: 3,
						fill: 'red',
					}}
				/>
			)}
			{withSorting ? (
				<TableSortLabel
					active={isSortingActive}
					style={{
						marginTop: -1,
						justifyContent: column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-start' : 'flex-start',
					}}
					direction={dir}
					onClick={() => onSortClick(dir === 'asc' ? 'desc' : 'asc')}
				>
					{title ? (
						<Tooltip title={title} enterDelay={100}>
							<span style={{ cursor: 'pointer' }}>
								<Label style={{ cursor: 'pointer' }} />
							</span>
						</Tooltip>
					) : (
						<Tooltip title={title} enterDelay={100}>
							<span style={{ cursor: 'pointer' }}>
								<Label style={{ cursor: 'pointer' }} />
							</span>
						</Tooltip>
					)}
				</TableSortLabel>
			) : title ? (
				<Tooltip title={title} enterDelay={100}>
					<span>
						<Label />
					</span>
				</Tooltip>
			) : (
				<Tooltip title={title} enterDelay={100}>
					<span>
						<Label />
					</span>
				</Tooltip>
			)}
		</TableCell>
	);
};

export default SuperTableHeadCell;
