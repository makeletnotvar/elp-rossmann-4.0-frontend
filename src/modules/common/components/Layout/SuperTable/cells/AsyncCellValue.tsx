import cn from 'classnames';
import { SuperTableRowCellProps } from 'modules/common/components/Layout/SuperTable/cells/SuperTableRowCell';
import { usePointValue } from 'modules/common/redux/poll';
import React from 'react';
import styles from '../SuperTable.module.scss';

interface AsyncCellValueProps extends Pick<SuperTableRowCellProps, 'rowData' | 'columnName'> {
	custom: (value: any) => any | null;
	onClick?: (value: number | string, row: any) => void;
}

export const AsyncCellValue: React.FC<AsyncCellValueProps> = ({ rowData, columnName, custom, onClick }) => {
	const pointValue = usePointValue((rowData as any)[columnName]);
	const value = pointValue ? pointValue.value : '---';

	return (
		<span className={cn({ [styles.link]: onClick })} onClick={() => onClick && onClick(pointValue?.value || 0, rowData)}>
			{custom(value) || value}
		</span>
	);
};
