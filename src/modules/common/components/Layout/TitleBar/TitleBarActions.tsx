import cn from 'classnames';
import * as React from 'react';
import styles from './TitleBar.module.scss';

interface TitleBarActionsProps {
	children: React.ReactNode;
	className?: string;
}

const TitleBarActions: React.FC<TitleBarActionsProps> = ({ children, className }) => {
	return <div className={cn(styles.actions, className)}>{children}</div>;
};

export default TitleBarActions;
