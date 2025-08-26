import { Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import DOMPurify from 'dompurify';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { SelectItemType } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SelectDialog.module.scss';

export interface SelectDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (value: string, label: string) => void;
	data: SelectItemType[];
	value: string;
	title: string;
	message?: string;
	selectPlaceholder?: string;
	disabled?: boolean;
}

const SelectDialog: React.FC<SelectDialogProps> = ({ open, onClose, onConfirm, data, value, title, message, selectPlaceholder, disabled }) => {
	const [selected, select] = useState<string>(value || '');
	const { t } = useTranslation();

	const filteredData = useMemo(() => {
		return data;
	}, [data]);

	const formattedCurentValue = useMemo((): { value: string; label: string } | null => {
		const item = data.find(item => item.uuid === selected);
		return item ? { label: item.name, value: item.uuid } : null;
	}, [selected, data]);

	const cleanMessage = DOMPurify.sanitize(message || '');

	const theme = useTheme();

	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			className={styles.dialog}
			fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}
		>
			<DialogTitle className={styles.title} id='alert-dialog-title'>
				{title}
			</DialogTitle>
			<DialogContent className={styles.content}>
				<DialogContentText id='alert-dialog-description' dangerouslySetInnerHTML={{ __html: cleanMessage }} />
				<Autocomplete
					data-testid='options-select'
					options={filteredData}
					getOptionLabel={option => option.name}
					value={filteredData.find(item => item.uuid === selected) || null}
					onChange={(_, newValue) => {
						if (newValue) {
							select(newValue.uuid);
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
			</DialogContent>
			<DialogActions className={styles.actions}>
				<CancelButton size='small' onClick={onClose}>
					{t('general.cancel')}
				</CancelButton>
				<ConfirmButton
					size='small'
					noSubmit
					onClick={() => {
						formattedCurentValue && onConfirm(formattedCurentValue.value, formattedCurentValue.label);
					}}
					disabled={!selected}
				>
					Ok
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default SelectDialog;
