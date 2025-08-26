import { Button } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import styles from './Buttons.module.scss';

interface ConfirmButtonProps {
	children: React.ReactNode;
	size?: 'small' | 'medium' | 'large' | undefined;
	onClick?: (evt?: any) => void;
	disabled?: boolean;
	noSubmit?: boolean;
	className?: string;
	color?: 'inherit' | 'primary' | 'secondary';
	testId?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ children, size = 'small', onClick, disabled, noSubmit, className, color, testId }) => {
	return (
		<Button
			type={noSubmit ? 'button' : 'submit'}
			data-testid={testId ? testId : 'dialog-confirm'}
			className={cn(styles.confirmButton, className)}
			color={color ? color : 'secondary'}
			variant='contained'
			size={size}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</Button>
	);
};

export default ConfirmButton;
