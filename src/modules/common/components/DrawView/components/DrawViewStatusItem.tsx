import { Tooltip } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import React from 'react';
import styles from './DrawViewStatusItem.module.scss';

interface DrawViewStatusItemProps {
	isOnline: boolean;
	eventsCount: number;
}

const DrawViewStatusItem: React.FC<DrawViewStatusItemProps> = ({ isOnline, eventsCount }) => {
	if (isOnline && eventsCount <= 0) {
		return null;
	}

	if (isOnline && eventsCount > 0) {
		return <div className={styles.alarm}>{eventsCount}</div>;
	}

	if (!isOnline) {
		return (
			<Tooltip title='Brak komunikacji'>
				<CloseOutlined className={styles.comm} />
			</Tooltip>
		);
	}

	return null;
};

export default DrawViewStatusItem;
