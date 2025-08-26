import { DAY, MONTH, WEEK } from 'modules/consumption/constants/periods';
import moment from 'moment';
import styles from './ChartFormat.module.scss';

export const xAxisFormat =
	(settings: ConsumptionDataRequestSettings & { building: string }, data: ConsumptionData, full: boolean = false) =>
	(indexLabel: any) => {
		const currentDataItem = data.find(item => item.index === Number(indexLabel));

		switch (settings.period) {
			case DAY: {
				if (currentDataItem) {
					const startTs = currentDataItem.startValue.ts;
					return moment(startTs).format('LL');
				} else {
					return '--';
				}
			}
			case WEEK: {
				if (currentDataItem) {
					const startTs = currentDataItem.startValue.ts;
					return moment(startTs).week() + ' tydzień ' + moment(startTs).format('YYYY');
				} else {
					return '--';
				}
			}
			case MONTH: {
				if (currentDataItem) {
					const startTs = currentDataItem.startValue.ts;
					return moment(startTs).format(full ? 'MMMM' : 'MMM');
				} else {
					return '--';
				}
			}
			default:
				return indexLabel;
		}
	};

export const tooltipFormat =
	(settings: ConsumptionDataRequestSettings & { building: string }) =>
	(value: string | number | Array<string | number>, name: string, entry: any, index: number) => {
		return <label className={styles.consumption}>{Number(value).toFixed(2)}</label>;
	};

const dateRangeFormat = (dataItem: ConsumptionDataItem) => {
	const MOMENT_DATE_FORMAT = 'LLL';
	const { startValue, endValue } = dataItem;

	const startValueLabel = startValue.value.toFixed(1);
	const startValueDate = moment(startValue.ts).format(MOMENT_DATE_FORMAT);
	const endValueLabel = endValue.value.toFixed(1);
	const endValueDate = moment(endValue.ts).format(MOMENT_DATE_FORMAT);

	return (
		<>
			<span>
				Od <strong className={styles.value}>{startValueLabel}</strong> @ <strong>{startValueDate}</strong>
			</span>
			<br />
			<span>
				Do <strong className={styles.value}>{endValueLabel}</strong> @ <strong>{endValueDate}</strong>
			</span>
		</>
	);
};

export const tooltipLabelFormat =
	(data: ConsumptionData, settings: ConsumptionDataRequestSettings & { building: string }): any =>
	(indexLabel: any) => {
		const FULL_NAME = true;
		// dateKey isnt unique!!
		const currentDataItem = data.find(item => item.index === Number(indexLabel));
		const rangeString = currentDataItem ? dateRangeFormat(currentDataItem) : null;

		return (
			<span className={styles.tooltip}>
				<strong className={styles.title}>{xAxisFormat(settings, data, FULL_NAME)(Number(indexLabel))}</strong>
				<span className={styles.range}>{rangeString}</span>
			</span>
		);
	};

export const dataStats = (data: ConsumptionData) => {
	const consumptions = data.map(data => data.consumption);
	const min = Math.min(...consumptions);
	const max = Math.max(...consumptions);
	const avg = data.reduce((summary, item) => summary + item.consumption, 0) / data.length;

	return {
		min,
		max,
		avg,
	};
};
