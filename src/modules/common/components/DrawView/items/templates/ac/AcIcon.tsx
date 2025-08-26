import { AcUnitOutlined } from '@mui/icons-material';
import cn from 'classnames';
import * as React from 'react';
import styles from './AcIcon.module.scss';

const AcIcon: React.FC<{ active: boolean }> = ({ active }) => {
	const classes = cn(styles.icon, {
		[styles.active]: active,
	});

	return <AcUnitOutlined className={classes} />;
};

export default AcIcon;
