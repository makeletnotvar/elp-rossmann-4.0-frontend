import LastChartItem from 'modules/data/components/LastCharts/LastChartItem';
import { LastChartConfig } from 'modules/data/localStorage/lastCharts';
import * as React from 'react';
import styles from './LastCharts.module.scss';

interface LastChartsProps {
	configs: LastChartConfig[];
	onOpen: (config: LastChartConfig) => void;
}

const LastCharts: React.FC<LastChartsProps> = ({ configs, onOpen }) => {
	return (
		<ul className={styles.list}>
			{configs.map((config, index) => (
				<LastChartItem key={index} config={config} onClick={() => onOpen(config)} />
			))}
		</ul>
	);
};

export default LastCharts;
