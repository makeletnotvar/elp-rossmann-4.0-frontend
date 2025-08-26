import { List } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import { CSSProperties } from 'react';
import styles from './VertIconsList.module.scss';

interface VertIconsListProps {
	children: React.ReactNode;
	className?: string;
	size?: number;
}

const VertIconsList: React.FC<VertIconsListProps> = ({ children, className, size }) => {
	const style: CSSProperties = {};

	if (size) {
		style.width = size;
	}

	return (
		<List className={cn(styles.list, className)} style={style}>
			{children}
		</List>
	);
};

export default VertIconsList;
