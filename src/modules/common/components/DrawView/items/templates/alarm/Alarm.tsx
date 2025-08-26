import cn from 'classnames';
import * as React from 'react';
import styles from './Alarm.module.scss';

interface AlarmProps {
	pointValue: PointValue;
}

const Alarm: React.FC<AlarmProps> = ({ pointValue }) => {
	return (
		<span className={cn(styles.alarm, { [styles.active]: pointValue.value > 0 })}>
			<span>{pointValue.value > 0 ? '⚠' : '✓'}</span>
		</span>
	);
};

export default Alarm;
