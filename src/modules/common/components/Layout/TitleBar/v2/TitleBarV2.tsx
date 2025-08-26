import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import styles from './TitleBarV2.module.scss';

interface TitleBarV2Props {
	children: React.ReactNode;
	label: string;
	icon: any;
	className?: string;
	labelClassName?: string;
}

const TitleBarV2: React.FC<TitleBarV2Props> = ({ label, icon: Icon, className, labelClassName, children }) => {
	return (
		<AppBar position='static' color='primary' className={cn(styles.titleBar, className)}>
			<Toolbar className={styles.toolbar}>
				<IconButton edge='start' color='inherit' aria-label='Menu' className={styles.icon}>
					<Icon />
				</IconButton>
				<Typography variant='h6' className={cn(styles.label, labelClassName)}>
					{label}
				</Typography>
			</Toolbar>
			{children && <div className={styles.actions}>{children}</div>}
		</AppBar>
	);
};

export default TitleBarV2;
