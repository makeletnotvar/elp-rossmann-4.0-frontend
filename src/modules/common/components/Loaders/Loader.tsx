import { CircularProgress } from '@mui/material';
import React, { CSSProperties, useEffect, useState } from 'react';
import styles from './Loader.module.scss';

interface LoaderProps {
	color?: 'primary' | 'secondary';
	label?: string;
	style?: CSSProperties;
	delay?: number;
	flex?: boolean;
	size?: number;
}

const Loader: React.FC<LoaderProps> = ({ color = 'secondary', label, size = 20, style, delay = 0, flex }) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, delay);
		return () => clearTimeout(timer);
	}, [delay]);

	return (
		isVisible &&
		(flex ? (
			<div style={{ ...style }} className={styles.preloaderFlex}>
				<CircularProgress size={size} disableShrink variant='indeterminate' color={color} />
				{label && <label>{label}</label>}
			</div>
		) : (
			<div style={{ ...style }} className={styles.preloader}>
				<CircularProgress size={size} disableShrink variant='indeterminate' color={color} />
				{label && <label>{label}</label>}
			</div>
		))
	);
};

export default Loader;
