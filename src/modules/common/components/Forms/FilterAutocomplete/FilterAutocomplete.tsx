import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Autocomplete, Checkbox, Chip, CircularProgress, TextField } from '@mui/material';
import { isArray } from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './FilterAutocomplete.module.scss';

const icon = <CheckBoxOutlineBlank fontSize='small' />;
const checkedIcon = <CheckBox fontSize='small' />;

interface FilterAutocompleteProps {
	data: {
		value: string;
		label: string;
	}[];
	dataToFill?: {
		value: string;
		label: string;
	}[];
	activeData: string[];
	activeDataBy?: 'value' | 'label';
	label: string;
	placeholder: string;
	loading?: boolean;
	param: string;
	onChange: (value: any, label: any) => void;
	onChangeText?: (text: string) => void;
	onLoad?: () => void;
	disabled?: boolean;
}

const FilterAutocomplete: React.FC<FilterAutocompleteProps> = ({
	data,
	activeData,
	activeDataBy = 'value',
	label,
	placeholder,
	loading,
	param,
	onChange,
	onLoad,
	onChangeText,
	dataToFill,
	disabled,
}) => {
	const [inputValue, setInputValue] = useState('');
	const [activeFiltersAutocomplete, setActiveFiltersAutocomplete] = useState<string[]>([]);
	const [options, setOptions] = useState(data);
	const [selectedOptions, setSelectedOptions] = useState<{ value: string; label: string }[]>([]);

	useEffect(() => {
		if (dataToFill) {
			let updatedOptions = [...data];
			updatedOptions = [...updatedOptions, ...dataToFill.filter(newItem => !updatedOptions.some(existingItem => existingItem.value === newItem.value))];
			setOptions(updatedOptions);
		} else {
			setOptions(data);
		}
	}, [data, dataToFill, selectedOptions]);

	useEffect(() => {
		if (activeData && activeData.includes('ALL')) {
			setActiveFiltersAutocomplete(options.map(item => item[activeDataBy]));
		} else {
			setActiveFiltersAutocomplete(activeData);
		}
	}, [activeData, options, activeDataBy]);

	const handleChange = (evt: any, values: { value: string; label: string }[]) => {
		const selectedValues = values.map(value => value[activeDataBy]);

		values.forEach(value => {
			if (!selectedOptions.some(option => option.value === value.value)) {
				setSelectedOptions(prevSelected => [...prevSelected, value]);
			}
		});

		if (!dataToFill && data.length > 1 && selectedValues.length === data.length) {
			onChange(param, 'ALL');
		} else {
			onChange(param, selectedValues);
		}
		setActiveFiltersAutocomplete(selectedValues);
	};

	return (
		<Autocomplete
			multiple
			disabled={disabled}
			size='small'
			limitTags={2}
			options={[...options]}
			value={(options || []).filter(item =>
				isArray(activeFiltersAutocomplete)
					? (activeFiltersAutocomplete || []).some(filter => String(filter) === String(item[activeDataBy]))
					: activeFiltersAutocomplete === item[activeDataBy]
			)}
			loading={loading}
			onOpen={options.length <= 0 && onLoad ? () => onLoad() : undefined}
			loadingText='Ładowanie...'
			noOptionsText='Brak wyników'
			disableCloseOnSelect
			getOptionLabel={option => option.label}
			renderOption={(props, option, { selected }) => (
				<li
					{...props}
					onClick={() => {
						setInputValue('');
						onChangeText && onChangeText('');
					}}
				>
					<Checkbox icon={icon} size='small' checkedIcon={checkedIcon} style={{ marginRight: 8, width: '10px', height: '10px' }} checked={selected} />
					{option.label}
				</li>
			)}
			fullWidth
			className={styles.autocomplete}
			onChange={handleChange}
			onInputChange={(event, value, reason) => {
				if (onChangeText && reason === 'input') {
					setInputValue(value);
					onChangeText(value);
				} else if (!onChangeText && reason === 'input') {
					setInputValue(value);
				}
			}}
			inputValue={inputValue}
			renderInput={params => (
				<TextField
					{...params}
					variant='standard'
					size='small'
					fullWidth
					label={label}
					placeholder={placeholder}
					className={styles.textField}
					InputLabelProps={{
						shrink: true,
					}}
					InputProps={{
						...params.InputProps,
						endAdornment: <React.Fragment>{loading ? <CircularProgress color='inherit' size={20} /> : null}</React.Fragment>,
					}}
				/>
			)}
			renderTags={(tagValue, getTagProps) =>
				tagValue.map((option, index) => (
					<Chip size='small' label={option.label} {...getTagProps({ index })} key={index} style={{ backgroundColor: 'rgba(238, 238, 238, 0.86)' }} />
				))
			}
		/>
	);
};

export default FilterAutocomplete;
