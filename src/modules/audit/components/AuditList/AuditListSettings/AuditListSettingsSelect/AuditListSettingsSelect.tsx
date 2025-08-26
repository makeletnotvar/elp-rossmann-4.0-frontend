import { Autocomplete, IconButton, TextField, useMediaQuery, useTheme } from '@mui/material';
import SelectDialog from 'modules/common/components/Dialogs/SelectDialog/SelectDialog';
import * as React from 'react';
import { useState } from 'react';
import styles from './AuditListSettingsSelect.module.scss';

interface AuditListSettingsSelectProps {
	value: string;
	onChange: (value: string, label: string) => void;
	selectPlaceholder?: string;
	selectTitle?: string;
	disabled?: boolean;
	icon?: any;
	data: {
		uuid: string;
		name: string;
	}[];
	fetched: boolean;
}

export const useSelectBuildingDialog = () => {
	const [open, setOpen] = useState<boolean>(false);

	return {
		open,
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
	};
};

const AuditListSettingsSelect: React.FC<AuditListSettingsSelectProps> = ({
	onChange,
	value,
	selectPlaceholder,
	selectTitle,
	disabled,
	icon: Icon,
	data,
	fetched,
}) => {
	const theme = useTheme();
	const { open, onOpen, onClose } = useSelectBuildingDialog();
	const changeHandler = (value: string, label: string) => {
		onChange(value, label);
		onClose();
	};

	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	return isMobileSize ? (
		<>
			<div className={styles.buildingSelectField}>
				<IconButton size='small' disabled={disabled} onClick={onOpen} color='primary'>
					<Icon />
				</IconButton>
			</div>
			{open && fetched && (
				<SelectDialog
					open={open}
					data={data || []}
					onClose={onClose}
					onConfirm={changeHandler}
					title={selectTitle || 'Wybierz'}
					selectPlaceholder={selectPlaceholder}
					value={value}
					disabled={disabled}
				/>
			)}
		</>
	) : (
		<Autocomplete
			data-testid='options-select'
			options={data}
			disabled={disabled}
			disableClearable
			getOptionLabel={option => option.name}
			value={data.find(item => item.uuid === value) || { uuid: '', name: '' }}
			onChange={(_, newValue) => {
				if (newValue) {
					onChange(newValue.uuid, newValue.name);
				}
			}}
			noOptionsText='Brak wyników'
			renderInput={params => <TextField {...params} style={{ minWidth: 200 }} placeholder={selectPlaceholder || 'Wybierz...'} disabled={disabled} />}
			renderOption={(props, option) => (
				<li {...props} data-testid={`menu-item-${option.name}`}>
					{option.name}
				</li>
			)}
		/>
	);
};

export default AuditListSettingsSelect;
