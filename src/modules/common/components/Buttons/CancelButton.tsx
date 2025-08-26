import { Button } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import styles from './Buttons.module.scss';

interface CancelButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	size?: 'small' | 'medium' | 'large' | undefined;
	className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ children, size, onClick, disabled, className }) => {
	return (
		<Button type='button' className={cn(styles.cancelButton, className)} variant='text' size={size || 'small'} onClick={onClick} disabled={disabled}>
			{children}
		</Button>
	);
};

export default CancelButton;
