import { MeetingRoomOutlined } from '@mui/icons-material';
import cn from 'classnames';
import * as React from 'react';
import styles from './CurIcon.module.scss';

const CurIcon: React.FC<{ active: boolean }> = ({ active }) => {
	const classes = cn(styles.icon, {
		[styles.active]: active,
	});

	return <MeetingRoomOutlined className={classes} />;
};

export default CurIcon;
