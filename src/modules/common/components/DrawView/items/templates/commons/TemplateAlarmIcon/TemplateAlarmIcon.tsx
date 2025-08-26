import * as React from 'react';

import { WarningOutlined } from '@mui/icons-material';
import cn from 'classnames';
import styles from './TemplateAlarmIcon.module.scss';

const TemplateAlarmIcon: React.FC<{ active: boolean; className?: string }> = ({ active, className }) => {
	return active ? <WarningOutlined data-testid='alarm-icon' className={cn(styles.icon, className)} /> : null;
};

export default TemplateAlarmIcon;
