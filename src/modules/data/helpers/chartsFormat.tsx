import { DAY_TS } from 'helpers/date';
import { renderPointRawValue } from 'modules/common/helpers/points/renderers';
import moment from 'moment';

/**
 * Recharts custom tooltip value formatterm, with configurable decimals
 */
export const tooltipValueFormatter =
	(points: Point[]): any =>
	(value: string | number | Array<string | number>, name: string, payload: any) => {
		if (String(payload.dataKey).startsWith('$')) {
			return null;
		} else {
			const point: Point | undefined = points.find(p => p.uuid === payload.dataKey);
			const renderedValue = point ? renderPointRawValue(point, Number(value)) : value;
			return <b>{renderedValue}</b>;
		}
	};

/**
 * Recharts custom label formatter
 */
export const tooltipLabelFormatter: any = (label: string | number) => {
	return <b>{moment(Number(label)).format('LLLL')}</b>;
};

/**
 * Return data time range unit, between the oldest and the newest value
 *
 */
type TimeRangeType = 'days' | 'hours';
export const getDataRangeTimeUnit = (fromTs: number, toTs: number): TimeRangeType => {
	const THRESHOLD_IN_DAYS = 1;
	const distance = toTs - fromTs;
	return distance > DAY_TS * THRESHOLD_IN_DAYS ? 'days' : 'hours';
};

/**
 * Return label datetime formatter depends on data time range.
 * days -  Date
 * hours - Time
 *
 */
export const timeAxisLabelsFormatter = (fromTs: number, toTs: number) => (ts: number) => {
	// const timeRangeUnit = getDataRangeTimeUnit(fromTs, toTs);
	// const format = timeRangeUnit === 'days' ? 'LL' : 'hh:mm DD.MM';

	// Temporary format is static
	const format = 'HH:mm DD.MM';
	return moment(ts).format(format);
};
