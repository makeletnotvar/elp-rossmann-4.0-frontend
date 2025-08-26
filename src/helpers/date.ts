/**
 * Due to using system on remotely RDP client, where system is not PL version
 * forcing pl-Pl locale format is required to show correct, pretty dates strings
 */
const FORCED_LOCALE = 'pl-Pl';

export function dateString(timestamp: number | undefined, invalidMessage?: string): string {
	const DEFAULT_INVALID_DATE_MESSAGE = '-';
	if (timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleString(FORCED_LOCALE || undefined);
	}
	return invalidMessage || DEFAULT_INVALID_DATE_MESSAGE;
}

export function dateWithoutTimeString(timestamp: number | undefined | null, invalidMessage?: string): string {
	const DEFAULT_INVALID_DATE_MESSAGE = '-';
	if (timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleDateString(FORCED_LOCALE || undefined);
	}
	return invalidMessage || DEFAULT_INVALID_DATE_MESSAGE;
}

export const DAY_TS = 1000 * 60 * 60 * 24;
export const YEAR_TS = DAY_TS * 365;

export function isValidTimestamp(ts: any): boolean {
	return ts !== null && ts !== undefined && ts > 0;
}

type FormattedDuration = {
	value: number | string;
	unit: 'min' | 'h' | 'dni';
	secondValue?: string;
	secondUnit?: 'min' | 'h' | 'dni';
};

const formatNumber = (number: number, toFixed?: number): number | string => {
	const formattedValue = Number(number);

	if (Number.isInteger(formattedValue)) {
		return Math.round(formattedValue);
	}

	if (toFixed) {
		return formattedValue.toFixed(toFixed);
	}

	return Math.round(formattedValue);
};

export const formatDuration = (valueInMinutes?: number | null, toFixed?: number): FormattedDuration | null => {
	if (valueInMinutes == null) return null;

	const totalMinutes = valueInMinutes;
	const totalHours = totalMinutes / 60;
	const totalDays = totalHours / 24;

	if (totalMinutes < 60) {
		return {
			value: `${formatNumber(totalMinutes, toFixed)}`,
			unit: 'min',
		};
	} else if (totalDays < 5) {
		const hours = Math.floor(totalHours);
		const minutes = Math.round(totalMinutes % 60);

		const result: FormattedDuration = {
			value: `${formatNumber(hours, toFixed)}`,
			unit: 'h',
		};

		if (minutes > 0) {
			result.secondValue = `${formatNumber(minutes, toFixed)}`;
			result.secondUnit = 'min';
		}

		return result;
	} else {
		const days = Math.floor(totalDays);
		const hours = Math.floor(totalHours % 24);

		const result: FormattedDuration = {
			value: `${formatNumber(days, toFixed)}`,
			unit: 'dni',
		};

		if (hours > 0) {
			result.secondValue = `${formatNumber(hours, toFixed)}`;
			result.secondUnit = 'h';
		}

		return result;
	}
};
