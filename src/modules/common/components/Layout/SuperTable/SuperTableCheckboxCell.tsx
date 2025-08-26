import { Checkbox, TableCell } from '@mui/material';
import * as React from 'react';
// const styles = require("./SuperTableCheckboxCell.scss");

interface SuperTableCheckboxCellProps {}

const SuperTableCheckboxCell: React.FC<SuperTableCheckboxCellProps> = () => {
	return (
		<TableCell padding='checkbox'>
			<Checkbox />
		</TableCell>
	);
};

export default SuperTableCheckboxCell;
