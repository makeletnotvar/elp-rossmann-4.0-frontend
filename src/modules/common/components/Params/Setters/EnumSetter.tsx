import { MenuItem, Select } from '@mui/material';
import { SetterProps } from 'modules/common/components/Params/Setters/Setter';
import * as React from 'react';
import styles from './Setter.module.scss';

interface EnumSetterProps extends SetterProps {}

const EnumSetter: React.FC<EnumSetterProps> = ({ point, value, onChange, disabled, customStyle }) => {
	const render = point.customRender as EnumRender;

	const changeHandler = (evt: any) => {
		onChange(evt.target.value);
	};

	return (
		<Select value={value} onChange={changeHandler} className={styles.select} style={customStyle} disabled={disabled}>
			{Object.entries(render.states).map(([key, value]) => (
				<MenuItem key={key} value={key}>
					{value}
				</MenuItem>
			))}
		</Select>
	);
};

export default EnumSetter;
