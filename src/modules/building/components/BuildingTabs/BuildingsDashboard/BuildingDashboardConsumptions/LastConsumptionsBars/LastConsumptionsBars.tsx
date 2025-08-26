import cn from 'classnames';
import * as React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from './LastConsumptionsBars.module.scss';

interface LastConsumptionsBarsProps {
	building: Building;
}

const LastConsumptionsBars: React.FC<LastConsumptionsBarsProps> = ({ building }) => {
	let last1 = 0;
	let last7 = 0;
	let last30 = 0;

	const consumptions = building.consumptions;

	if (consumptions) {
		if (consumptions.last1 !== undefined) last1 = consumptions.last1;
		if (consumptions.last7 !== undefined) last7 = consumptions.last7;
		if (consumptions.last30 !== undefined) last30 = consumptions.last30;
	}

	const last1Max = (last30 / 30) * 2.5;
	const last7Max = (last30 / 30) * 7 * 1.8;
	const last30Max = last30 * 1.2;
	const avg = last30 / 30;

	return (
		<div className={styles.topConsumptionsBars}>
			<h3>Sumaryczne zużycie</h3>
			<div className={styles.bars}>
				<div className={styles.bar}>
					<label>Dziś</label>
					<CircularProgressbar strokeWidth={12} value={last1} maxValue={last1Max} text={last1.toFixed(0)} />
				</div>
				<div className={styles.bar}>
					<label>Ten tydzień</label>
					<CircularProgressbar strokeWidth={12} value={last7} maxValue={last7Max} text={last7.toFixed(0)} />
				</div>
				<div className={styles.bar}>
					<label>Ten miesiąc</label>
					<CircularProgressbar strokeWidth={12} value={last30} maxValue={last30Max} text={last30.toFixed(0)} />
				</div>
				<div className={cn(styles.bar, styles.avg)}>
					<label>Średnia</label>
					<CircularProgressbar strokeWidth={12} value={avg} maxValue={avg * 1.2} text={avg.toFixed(0)} />
				</div>
			</div>
		</div>
	);
};

export default LastConsumptionsBars;
