import { ToysOutlined } from '@mui/icons-material';
import * as React from 'react';
import styles from './FcIcon.module.scss';

import cn from 'classnames';

const FcIcon: React.FC<{ active: boolean }> = ({ active }) => {
	const classes = cn(styles.icon, {
		[styles.active]: active,
	});

	return <ToysOutlined className={classes} />;
};

export default FcIcon;
