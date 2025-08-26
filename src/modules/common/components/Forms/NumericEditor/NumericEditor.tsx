import { TextField } from '@mui/material';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NumericEditor.module.scss';

interface NumericEditorProps {
	value: NumericRender;
	onChange: (nextValue: NumericRender) => void;
}

const NumericEditor: React.FC<NumericEditorProps> = ({ value, onChange }) => {
	const { decimals, max, min, step, suffix } = value;
	const { t } = useTranslation();

	const changeHandler = useCallback(
		(param: string, fn?: any) => (evt: React.ChangeEvent<HTMLInputElement>) => {
			const paramValue = fn ? fn(evt.currentTarget.value) : evt.currentTarget.value;
			onChange({ ...value, [param]: paramValue });
		},
		[value]
	);

	return (
		<>
			<div className={styles.row}>
				<TextField
					value={decimals ? decimals : decimals === 0 ? 0 : 2}
					placeholder={t('devices.points.decimals')}
					label={t('devices.points.decimals')}
					onChange={changeHandler('decimals', Number)}
					inputProps={{ type: 'number', min: 0, max: 5 }}
					onKeyUp={evt => {
						evt.preventDefault();
						return false;
					}}
					className={styles.decimals}
				/>
				<TextField
					value={suffix || ''}
					placeholder={t('devices.points.suffix')}
					label={t('devices.points.suffix')}
					onChange={changeHandler('suffix')}
					className={styles.suffix}
				/>
			</div>
			<div className={styles.row}>
				<TextField
					value={step || 1}
					placeholder={t('devices.points.step')}
					label={t('devices.points.step')}
					onChange={changeHandler('step', Number)}
					inputProps={{ type: 'number', min: 0, step: 0.01 }}
					className={styles.step}
				/>
				<TextField
					value={min ? min : min === 0 ? 0 : -999999}
					placeholder={t('devices.points.min')}
					label={t('devices.points.min')}
					onChange={changeHandler('min', Number)}
					inputProps={{ type: 'number', max: (max ? max : max === 0 ? 100 : 999999) - 1 }}
					className={styles.min}
				/>
				<TextField
					value={max ? max : max === 0 ? 100 : 999999}
					placeholder={t('devices.points.max')}
					label={t('devices.points.max')}
					onChange={changeHandler('max', Number)}
					inputProps={{ type: 'number', min: (min ? min : min === 0 ? 0 : -999999) + 1 }}
					className={styles.max}
				/>
			</div>
		</>
	);
};

export default NumericEditor;
