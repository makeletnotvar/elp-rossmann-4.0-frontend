import { Modal, ModalProps } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import styles from './CustomFileInputDialog.module.scss';

interface CustomFileInputDialogProps {
	children?: React.ReactNode;
	open: ModalProps['open'];
	onClose: ModalProps['onClose'];
}

const CustomFileInputDialog: React.FC<CustomFileInputDialogProps> = ({ children, open, onClose }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<div className={cn(styles.paper, styles.dialog)}>{children}</div>
		</Modal>
	);
};

export default CustomFileInputDialog;
