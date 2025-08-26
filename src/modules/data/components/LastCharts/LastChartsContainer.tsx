import LastCharts from 'modules/data/components/LastCharts/LastCharts';
import lastCharts, { LastChartConfig } from 'modules/data/localStorage/lastCharts';
import queryString from 'query-string';
import * as React from 'react';
import { useEffect, useState } from 'react';
import useRouter from 'use-react-router';
import styles from './LastCharts.module.scss';

interface LastChartsContainerProps {}

const useLastCharts = () => {
	const [configs, setConfigs] = useState<LastChartConfig[]>([]);

	useEffect(() => {
		const configs: LastChartConfig[] | null = lastCharts.read();
		configs && setConfigs(configs.reverse());
	}, []);

	return { configs };
};

const LastChartsContainer: React.FC<LastChartsContainerProps> = () => {
	const { configs } = useLastCharts();
	const { history } = useRouter();

	const openConfigHandler = (config: LastChartConfig) => {
		const { points, fromTs: from, toTs: to } = config;

		const urlConfig = {
			p: points.map(p => p.uuid),
			from,
			to,
		};

		const nextURL = `/data/?${queryString.stringify(urlConfig)}`;
		history.push(nextURL);
	};

	return (
		<div className={styles.container}>
			<div className={styles.title}>Twoje ostatnie wykresy</div>
			<LastCharts configs={configs} onOpen={openConfigHandler} />
		</div>
	);
};

export default LastChartsContainer;
