import { IconButton, TextField } from '@mui/material';
import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Setter2Props } from './Setter2';
import styles from './Setter2.module.scss';

interface NumericSetter2Props extends Setter2Props {}

const NumericSetter2: React.FC<NumericSetter2Props> = ({ point, value, onChange, disabled = false, setIsValid }) => {
	const render = point.customRender as NumericRender;
	const step = render && render.step !== undefined && render.step !== 0 ? render.step : 0.1;
	const decimals = render.decimals || 1;

	const [tempValue, setTempValue] = useState<string>(value.toFixed(decimals));

	const minValue = render.min !== undefined ? render.min : -Infinity;
	const maxValue = render.max !== undefined ? render.max : Infinity;
	const decrementDisabled = Number(tempValue) <= minValue || disabled;
	const incrementDisabled = Number(tempValue) >= maxValue || disabled;

	const roundToStep = (val: number) => {
		return Math.round(val / step) * step;
	};

	const roundToDecimals = (val: number) => {
		const factor = Math.pow(10, decimals);
		return Math.round(val * factor) / factor;
	};

	const changeTempHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const newVal = evt.target.value;
		setTempValue(newVal);

		const numeric = parseFloat(newVal);
		if (isNaN(numeric) || numeric < minValue || numeric > maxValue) {
			setIsValid(false);
		} else {
			setIsValid(true);
		}
	};

	const changeHandler = () => {
		let numericValue = parseFloat(tempValue);
		if (!Number.isFinite(numericValue)) return;

		numericValue = roundToStep(numericValue);
		numericValue = roundToDecimals(numericValue);

		numericValue = Math.min(Math.max(numericValue, minValue), maxValue);
		const formatted = numericValue.toFixed(decimals);

		setTempValue(formatted);
		onChange(numericValue);
		setIsValid(true);
	};

	const updateValue = (delta: number) => {
		const numeric = parseFloat(tempValue) || 0;
		let newValue = roundToDecimals(roundToStep(numeric + delta));
		newValue = Math.min(Math.max(newValue, minValue), maxValue);

		setTempValue(newValue.toFixed(decimals));
		onChange(newValue);
		setIsValid(true);
	};

	const debouncedChangeHandler = useMemo(() => {
		return debounce(() => changeHandler(), 3000);
	}, [tempValue]);

	useEffect(() => {
		debouncedChangeHandler();
		return () => {
			debouncedChangeHandler.cancel();
		};
	}, [tempValue]);

	useEffect(() => {
		setTempValue(value.toFixed(decimals));
	}, [value, decimals]);

	return (
		<div className={styles.container}>
			<div className={styles.numeric}>
				<IconButton onClick={() => updateValue(-step)} size='small' className={cn(styles.button, styles.decrement)} disabled={decrementDisabled}>
					<RemoveOutlined />
				</IconButton>
				<TextField
					size='small'
					variant='standard'
					type='number'
					value={tempValue}
					onChange={changeTempHandler}
					onBlur={changeHandler}
					className={styles.number}
					inputProps={{ min: minValue, max: maxValue }}
				/>
				<IconButton onClick={() => updateValue(step)} size='small' className={cn(styles.button, styles.increment)} disabled={incrementDisabled}>
					<AddOutlined />
				</IconButton>
			</div>
			{(minValue || minValue === 0) && (maxValue || maxValue === 0) && (
				<span className={styles.info}>
					Ustaw wartość w przedziale od{' '}
					<span style={{ fontWeight: 600 }}>
						{minValue.toFixed(decimals)}
						{render?.suffix ? render.suffix : ''}
					</span>{' '}
					do{' '}
					<span style={{ fontWeight: 600 }}>
						{maxValue.toFixed(decimals)}
						{render?.suffix ? render.suffix : ''}
					</span>
				</span>
			)}
		</div>
	);
};

export default NumericSetter2;
