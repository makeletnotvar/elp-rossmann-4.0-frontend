import { Button } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import styles from './Buttons.module.scss';

interface DeleteButtonProps {
	children: React.ReactNode;
	size?: 'small' | 'medium' | 'large' | undefined;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	testId?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ children, size, onClick, disabled, className, testId }) => {
	return (
		<Button
			data-testid={testId ? testId : 'dialog-delete'}
			type='button'
			className={cn(styles.deleteButton, className)}
			variant='text'
			size={size || 'small'}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</Button>
	);
};

export default DeleteButton;
