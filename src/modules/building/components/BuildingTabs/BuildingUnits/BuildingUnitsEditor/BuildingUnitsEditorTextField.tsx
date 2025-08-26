import { TextField } from '@mui/material';
import { ChangeEvent, memo, useCallback, useState } from 'react';

const BuildingUnitsEditorTextField = memo(
	({
		initialValue,
		index,
		updateSingleParam,
		target,
		placeholder,
	}: {
		initialValue: string;
		index?: number;
		updateSingleParam: (paramIndex: number, target: 'name' | 'value', inputValue: string) => void;
		target: 'name' | 'value';
		placeholder: string;
	}) => {
		const [value, setValue] = useState(initialValue);

		const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
			setValue(evt.target.value);
		}, []);

		return (
			<TextField
				className='BuildingUnitsEditorTextField'
				size='small'
				fullWidth
				value={value}
				onChange={handleChange}
				onBlur={() => updateSingleParam(index || 0, target, value)}
				placeholder={placeholder}
			/>
		);
	}
);

export default BuildingUnitsEditorTextField;
