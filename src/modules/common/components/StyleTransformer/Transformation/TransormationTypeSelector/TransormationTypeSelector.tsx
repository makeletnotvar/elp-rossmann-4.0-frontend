import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { StyleTransformerInputType, StyleTransformerType } from 'typings/styleTransformer';
import styles from './TransormationTypeSelector.module.scss';

interface TransformationTypeSelectorProps {
	selectedType: StyleTransformerType;
	setSelectedType: (selectedType: StyleTransformerType) => void;
	inputType: StyleTransformerInputType;
}

const TransormationTypeSelector: React.FC<TransformationTypeSelectorProps> = ({ selectedType, setSelectedType, inputType }) => {
	const TRANSFORMATIONS_TYPES = {
		[StyleTransformerType.STATES]: 'Stany',
		[StyleTransformerType.TRANSITION]: 'Płynne przejścia',
		[StyleTransformerType.SCRIPT]: 'Skrypt',
	};

	return (
		<Autocomplete
			value={{ value: selectedType, label: TRANSFORMATIONS_TYPES[selectedType] }}
			isOptionEqualToValue={(option, value) => option.value === value.value}
			size='small'
			options={[StyleTransformerType.STATES, StyleTransformerType.TRANSITION]
				.filter(type => inputType === 'COLOR' || type !== StyleTransformerType.TRANSITION)
				.map(type => ({
					value: type,
					label: TRANSFORMATIONS_TYPES[type],
				}))}
			getOptionLabel={option => option.label || ''}
			style={{ width: 300 }}
			renderInput={params => (
				<TextField
					{...params}
					InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
					InputProps={{ ...params.InputProps, notched: true }}
					label='Tryb transformacji'
					placeholder='Wybierz tryb...'
				/>
			)}
			onChange={(evt, item) => setSelectedType(item.value)}
			disableClearable
			className={styles.autocomplete}
		/>
	);
};

export default TransormationTypeSelector;
