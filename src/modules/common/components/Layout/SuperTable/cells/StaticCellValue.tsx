import cn from 'classnames';
import DOMPurify from 'dompurify';
import { SuperTableCustomCellProps, SuperTableData } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import styles from './../SuperTable.module.scss';

interface StaticCellValueProps {
	translatedValue: any;
	customCell?: React.FunctionComponent<SuperTableCustomCellProps<any, any>>;
	rowData: SuperTableData;
	value: any;
	searchValue: string | null;
	columnName: string;
	index: number;
	onClick?: (value: number | string, row: any) => void;
}

export const StaticCellValue: React.FC<StaticCellValueProps> = ({
	translatedValue,
	customCell: CustomCell,
	rowData,
	value,
	searchValue,
	columnName,
	index,
	onClick,
}) => {
	const handleClick = () => onClick?.(value, rowData);
	const isClickable = Boolean(onClick);
	const linkClass = cn({ [styles.link]: isClickable });

	if (translatedValue !== null) {
		return isClickable ? (
			<span className={linkClass} onClick={handleClick}>
				{translatedValue}
			</span>
		) : (
			<span>{translatedValue}</span>
		);
	}

	if (CustomCell) {
		return <CustomCell value={value} row={rowData} columnName={columnName} index={index} />;
	}

	if (searchValue !== null) {
		const sanitized = DOMPurify.sanitize(searchValue);
		return <span className={cn(styles.searchQuery, { [styles.link]: isClickable })} onClick={handleClick} dangerouslySetInnerHTML={{ __html: sanitized }} />;
	}

	return isClickable ? (
		<span className={linkClass} onClick={handleClick}>
			{value}
		</span>
	) : (
		<>{value}</>
	);
};
