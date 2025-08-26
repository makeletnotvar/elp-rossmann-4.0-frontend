import { MenuItem, Select } from '@mui/material';
import { SetterProps } from 'modules/common/components/Params/Setters/Setter';
import React from 'react';
import styles from './Setter2.module.scss';

interface EnumSetter2Props extends SetterProps {}

const EnumSetter2: React.FC<EnumSetter2Props> = ({ point, value, onChange, disabled, customStyle }) => {
	const render = point.customRender as EnumRender;

	const changeHandler = (evt: any) => {
		onChange(Number(evt.target.value));
	};

	return (
		<Select
			variant='standard'
			value={value}
			onChange={changeHandler}
			className={styles.select}
			style={{ minWidth: '200px', ...customStyle }}
			disabled={disabled}
		>
			{Object.entries(render.states).map(([key, value]) => (
				<MenuItem key={key} value={key}>
					{value}
				</MenuItem>
			))}
		</Select>
	);
};

export default EnumSetter2;
