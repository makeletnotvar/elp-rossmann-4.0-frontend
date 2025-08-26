import { CloseOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import styles from './CustomDialog.module.scss';

interface CustomDialogProps {
	children: React.ReactNode;
	title?: string;
	customTitle?: React.ReactNode;
	open: boolean;
	onClose: () => void;
	icon?: MuiIconType;
	maxWidth?: false | 'xl' | 'xs' | 'sm' | 'md' | 'lg';
	dialogActions?: React.ReactNode;
	testId?: string;
	style?: CSSProperties;
	classnameTitle?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
	children,
	customTitle,
	classnameTitle,
	title,
	open,
	icon,
	maxWidth = 'lg',
	onClose,
	dialogActions,
	style,
}) => {
	const theme = useTheme();

	return (
		<Dialog
			open={open || false}
			className={styles.dialog}
			onClose={onClose}
			maxWidth={maxWidth}
			fullWidth
			fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}
		>
			<DialogTitle className={classNames(styles.title, classnameTitle)}>
				{icon}
				{customTitle ? customTitle : title}
				<IconButton size='small' className={styles.closeButton} onClick={onClose}>
					<CloseOutlined />
				</IconButton>
			</DialogTitle>
			<DialogContent className={styles.content} style={style}>
				{children}
			</DialogContent>
			{dialogActions && <DialogActions className={styles.actions}>{dialogActions}</DialogActions>}
		</Dialog>
	);
};

export default CustomDialog;
