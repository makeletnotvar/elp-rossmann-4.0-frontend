import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import DOMPurify from 'dompurify';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	open: boolean;
	testId?: string;
}

/**
 *
 * Deprecated -> use useConfirm hook
 *
 */
export function useConfirmDialog<T = any>() {
	const [isConfirm, setConfirm] = useState<boolean>(false);
	const [data, set] = useState<T | null>(null);

	return {
		isConfirm,
		openConfirm: () => setConfirm(true),
		closeConfirm: () => setConfirm(false),
		clear: () => set(null),
		set,
		data,
	};
}

export function useConfirm<T>(onSuccess: (buffer: T) => void) {
	const [buffer, setBuffer] = useState<T>();

	return {
		buffer,
		isOpen: buffer !== undefined,
		closeHandler: () => setBuffer(undefined),
		openHandler: (buffer?: T) => setBuffer(buffer || undefined),
		confirmHandler: () => {
			buffer && onSuccess(buffer);
			setBuffer(undefined);
		},
	};
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, open, onConfirm, onCancel, testId }) => {
	const cleanMessage = DOMPurify.sanitize(message);
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<Dialog
			open={open || false}
			onClose={onCancel}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}
		>
			<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description' dangerouslySetInnerHTML={{ __html: cleanMessage }} />
			</DialogContent>
			<DialogActions>
				<CancelButton size='small' onClick={onCancel}>
					{t('general.cancel')}
				</CancelButton>
				<ConfirmButton testId={testId} size='small' onClick={onConfirm}>
					{t('general.ok')}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
