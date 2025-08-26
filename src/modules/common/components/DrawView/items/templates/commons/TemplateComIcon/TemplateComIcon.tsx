import * as React from 'react';

import { SettingsInputAntennaOutlined } from '@mui/icons-material';
import cn from 'classnames';
import styles from './TemplateComIcon.module.scss';

const TemplateComIcon: React.FC<{ active: boolean; className?: string }> = ({ active, className }) => {
	return active ? <SettingsInputAntennaOutlined data-testid='com-icon' className={cn(styles.icon, className)} /> : null;
};

export default TemplateComIcon;
