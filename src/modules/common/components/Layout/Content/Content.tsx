import cn from 'classnames';
import * as React from 'react';
import styles from './Content.module.scss';

interface ContentProps {
	children: React.ReactNode;
	className?: string;
}

const Content: React.FC<ContentProps> = ({ children, className }) => <div className={cn(styles.content, className)}>{children}</div>;

export default Content;
