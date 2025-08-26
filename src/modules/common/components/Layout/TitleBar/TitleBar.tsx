import { AppBar, Toolbar, Typography } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import styles from './TitleBar.module.scss';

interface TitleBarProps {
	children?: React.ReactNode;
	custom?: React.ReactNode;
	label: string;
	icon: any;
	className?: string;
	labelClassName?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ label, custom, icon: Icon, className, labelClassName, children }) => {
	return (
		<AppBar position='static' color='primary' className={cn(styles.titleBar, className)} elevation={0}>
			<Toolbar classes={{ regular: styles.toolbar }} style={{ width: '100%' }}>
				<Typography variant='h6' className={cn(styles.label, labelClassName)}>
					{custom ? custom : label}
				</Typography>
				<div id='title-bar-custom' className={styles.titleBarCustom}></div>
			</Toolbar>
			{children && <div className={styles.actions}>{children}</div>}
		</AppBar>
	);
};

export default TitleBar;
