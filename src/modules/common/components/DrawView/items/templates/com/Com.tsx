import cn from 'classnames';
import * as React from 'react';
import styles from './Com.module.scss';

interface ComProps {
	pointValue: PointValue;
}

const Com: React.FC<ComProps> = ({ pointValue }) => {
	return (
		<span className={cn(styles.com, { [styles.error]: pointValue.value > 0 })}>
			<span>🔌</span>
		</span>
	);
};

export default Com;
