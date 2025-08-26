import { SvgIconProps } from '@mui/material';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import * as React from 'react';
import { ComponentType } from 'react';
import styles from './MediaTitleBar.module.scss';

interface MediaTitleBarProps {
	label: string;
	icon: ComponentType<SvgIconProps>;
	children?: React.ReactNode;
}

const MediaTitleBar: React.FC<MediaTitleBarProps> = ({ label, icon, children }) => {
	return (
		<TitleBar label={label} icon={icon} labelClassName={styles.titleLabel}>
			{children}
		</TitleBar>
	);
};

export default MediaTitleBar;
