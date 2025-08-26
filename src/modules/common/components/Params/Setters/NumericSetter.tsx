import IconButton from '@mui/material/IconButton';
import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { SetterProps } from 'modules/common/components/Params/Setters/Setter';
import * as React from 'react';
import styles from './Setter.module.scss';

interface NumericSetterProps extends SetterProps {}

const NumericSetter: React.FC<NumericSetterProps> = ({ point, value, onChange, disabled }) => {
	const render = point.customRender as NumericRender;

	const step = render && render.step !== undefined ? render.step : 0.1;

	const decimals = render.decimals || 1;

	const minValue = render.min !== undefined ? render.min : -Infinity;
	const maxValue = render.max !== undefined ? render.max : Infinity;
	const decrementDisabled = value <= minValue || disabled;
	const incrementDisabled = value >= maxValue || disabled;

	const changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = Number(evt.target.value);
		const isValid = Number.isFinite(nextValue) && nextValue >= minValue && nextValue <= maxValue;

		if (isValid) {
			onChange(nextValue);
		}
	};

	return (
		<div className={styles.numeric}>
			<IconButton onClick={() => onChange(value - step)} size='small' className={cn(styles.button, styles.decrement)} disabled={decrementDisabled}>
				<RemoveOutlined fontSize='inherit' />
			</IconButton>
			<span>
				<input type='number' value={value.toFixed(decimals)} step={step} onChange={changeHandler} className={styles.number} />
			</span>
			<IconButton onClick={() => onChange(value + step)} size='small' className={cn(styles.button, styles.increment)} disabled={incrementDisabled}>
				<AddOutlined fontSize='inherit' />
			</IconButton>
		</div>
	);
};

export default NumericSetter;
