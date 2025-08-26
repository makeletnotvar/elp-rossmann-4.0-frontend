import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import cn from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FilterGroup.module.scss';

const ALL = 'ALL';

type FilterParam<T> = keyof T;

type FilterValue<T> = T[] | 'ALL' | [];

type FilterValueObject<T> = {
	[param: string]: boolean;
};

interface FilterGroupMultiProps<T> {
	active: boolean;
	label: string;
	param: string;
	value: FilterValue<T>;
	values: T[];
	onChange: (param: string, value: FilterValue<T>) => void;
	onToggle: (param: string, checked: boolean) => void;
	translationPath?: string;
}

/**
 * Default values should be converted from FilterValue type to object with checkbox states
 * @param value
 * @param values
 */
function getDefaultValues<T>(value: FilterValue<T>, values: T[]): FilterValueObject<T> {
	return values.reduce(
		(vals, nextV) => ({
			...vals,
			[nextV as any]: value === 'ALL' || value instanceof Array ? (value as any[]).includes(nextV) : value === nextV,
		}),
		{}
	);
}

function FilterGroupMulti<T>({ value, onChange, values, param, label, active, onToggle, translationPath }: FilterGroupMultiProps<T>) {
	const [filterValues, setFilters] = useState<FilterValueObject<T>>(getDefaultValues<T>(value, values));
	const { t } = useTranslation();
	// Update handler
	function updateHandler(value: string) {
		return function (checked: boolean) {
			// Next filter state
			const nextFiltersState = { ...filterValues, [value]: checked };

			// Translate value to FilterValue format and callback it for parent
			const filtersArray: T[] = Object.keys(nextFiltersState)
				.map(key => (nextFiltersState[key] ? key : null))
				.filter(v => v !== null) as any;
			const nextValue: FilterValue<T> = values.every(val => filtersArray.includes(val as any)) ? ALL : filtersArray;
			onChange(param, nextValue);

			const isNextFiltersStateEmpty = Object.values(nextFiltersState).every(f => f === false);

			if (!isNextFiltersStateEmpty) {
				setFilters({ ...filterValues, [value]: checked });
			}
		};
	}

	function getChecked(valueName: any) {
		return filterValues[valueName] === true;
	}

	return (
		<FormGroup row className={cn(styles.group, { [styles.inactive]: !active })}>
			<div style={{ alignSelf: 'center' }}>
				<Checkbox checked={active} onChange={(evt, checked) => onToggle(param, checked)} color='primary' />
			</div>
			<FormLabel className={styles.label}>{label}</FormLabel>
			<div className={styles.inputs}>
				{values.map(valueName => {
					return (
						<FilterGroupMultiInput
							disabled={!active}
							checked={getChecked(valueName)}
							onChange={updateHandler(String(valueName))}
							value={translationPath ? t(`${translationPath}.${valueName}`) : valueName}
						/>
					);
				})}
			</div>
		</FormGroup>
	);
}

interface FilterGroupMultiInputProps<T> {
	value: any;
	checked: boolean;
	onChange: (state: boolean) => void;
	disabled: boolean;
}

function FilterGroupMultiInput<T>({ value, checked, onChange, disabled }: FilterGroupMultiInputProps<T>) {
	return (
		<FormControlLabel
			control={<Checkbox onChange={(evt, checked) => onChange(checked)} {...{ value, checked, disabled }} />}
			label={value}
			className={styles.label}
		/>
	);
}

export default FilterGroupMulti;
