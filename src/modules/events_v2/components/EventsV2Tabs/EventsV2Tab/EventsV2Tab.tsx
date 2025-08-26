import { Tab } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import styles from '../EventsV2Tabs.module.scss';

interface EventsV2TabProps {
	label: string;
	icon: MuiIconType;
	history: RouteComponentProps<object, any, unknown>;
	to: string;
	tabPath: string;
	value: number;
	disabled?: boolean;
}

const EventsV2Tab: React.FC<EventsV2TabProps> = ({ label, icon: Icon, history, to, tabPath, value, disabled }) => {
	const isActiveTab = (historyPath: string, tab: string) => {
		return cn(styles.tab, {
			[styles.activeTab]: historyPath.includes(tab),
		});
	};

	return (
		<Tab
			className={isActiveTab(history.location.pathname, tabPath)}
			icon={<Icon fontSize='small' />}
			label={label}
			value={value}
			component={RouterLink}
			to={to}
			disabled={disabled}
		/>
	);
};

export default EventsV2Tab;
