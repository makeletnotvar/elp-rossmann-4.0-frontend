import { Autocomplete, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { SelectItemType, useSelectorData } from '../../Dialogs/SelectDialog/SelectDialogContainer';
import styles from './StyleTransformerPointSelector.module.scss';

interface StyleTransformerPointSelectorProps {
	asyncData: Promise<SelectItemType[]>;
	pointRef?: PointReference | null;
	setFieldValue: {
		(
			field: 'transformerId' | 'pointRef' | 'type' | 'name' | 'config' | 'pointType' | 'active' | 'styleTransformerInputType',
			value: any,
			shouldValidate?: boolean | undefined
		): void;
		(field: string, value: any): void;
	};
}

const StyleTransformerPointSelector: React.FC<StyleTransformerPointSelectorProps> = ({ asyncData, pointRef, setFieldValue }) => {
	const [selected, setSelect] = useState<string>(pointRef ? pointRef.uuid : '');
	const { data } = useSelectorData(asyncData);

	const formattedCurentValue = useMemo((): { value: string; label: string } | null => {
		const item = data.find((item: any) => item.uuid === selected);
		return item ? { label: item.name, value: item.uuid } : null;
	}, [selected, data]);

	return (
		<Autocomplete
			value={formattedCurentValue || ({} as any)}
			isOptionEqualToValue={(option, value) => option.value === value.value}
			size='small'
			options={data.map((item: any) => ({ value: item.uuid, label: item.name }))}
			getOptionLabel={option => option.label || ''}
			style={{ width: 300 }}
			renderInput={params => (
				<TextField
					{...params}
					InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
					InputProps={{ ...params.InputProps, notched: true }}
					label='Punkt'
					placeholder='Wybierz punkt...'
				/>
			)}
			onChange={(evt, item) => {
				setFieldValue('pointRef', { uuid: item.value, name: item.label });
				setFieldValue('config', {});
				setSelect(item?.value || '');
			}}
			disableClearable
			className={styles.autocomplete}
		/>
	);
};

export default StyleTransformerPointSelector;
