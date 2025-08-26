import cn from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChartWrapper.module.scss';

interface ChartWrapperProps {
	children: React.ReactNode;
	title: string;
	pointType?: PointType;
	onStatsOpen: () => void;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ children, title, onStatsOpen }) => {
	const [actionsOpen, setActionsOpen] = useState<boolean>(false);
	const { t } = useTranslation();

	return (
		<div className={cn(styles.wrapper)}>
			<div data-testid='chart-display' className={cn(styles.content, { [styles.actionsOpen]: actionsOpen })}>
				{children}
			</div>
		</div>
	);
};

export default ChartWrapper;
