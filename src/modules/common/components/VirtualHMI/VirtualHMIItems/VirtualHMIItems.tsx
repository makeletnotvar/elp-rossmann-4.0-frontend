import { Paper } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import styles from './VirtualHMIItems.module.scss';

interface VirtualHMIItemsProps {
	children?: React.ReactNode;
	name: string;
	icon: React.ReactNode;
	onClick?: (data?: any) => void;
	isTextItem?: boolean;
}

const VirtualHMIItems: React.FC<VirtualHMIItemsProps> = ({ children, name, icon, onClick, isTextItem }) => {
	return (
		<Paper className={cn(styles.vhmiContainer, { [styles.isTextItem]: isTextItem })} onClick={onClick}>
			<div className={styles.vhmiIconContainer}>{icon}</div>
			<div
				className={cn(styles.vhmiContent, {
					[styles.emptyChildren]: !children,
				})}
			>
				<div className={cn(styles.vhmiName, { [styles.isTextItem]: isTextItem })}>{name}</div>
				{children}
			</div>
		</Paper>
	);
};

export default VirtualHMIItems;
