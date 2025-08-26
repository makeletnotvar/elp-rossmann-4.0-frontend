import { AppBar } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import styles from './TitleBar.module.scss';

interface MiniTitleBarProps {
	children: React.ReactNode;
}

const MiniTitleBar: React.FC<MiniTitleBarProps> = ({ children }) => {
	return (
		<AppBar position='static' className={cn(styles.miniTitleBar)}>
			<div className={styles.content}>{children}</div>
		</AppBar>
	);
};

export default MiniTitleBar;
