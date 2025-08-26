import { Button } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import styles from './Buttons.module.scss';

interface ClearButtonProps {
	children: React.ReactNode;
	size?: 'small' | 'medium' | 'large' | undefined;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
}

const ClearButton: React.FC<ClearButtonProps> = ({ children, size, onClick, disabled, className }) => {
	return (
		<Button
			type='button'
			className={cn(styles.clearButton, className)}
			color='inherit'
			variant='text'
			size={size || 'small'}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</Button>
	);
};

export default ClearButton;
