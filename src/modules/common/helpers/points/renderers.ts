import { dateString } from 'helpers/date';
import { limitDec } from 'helpers/numbers';

export const renderNumeric = (render: NumericRender, _value: PointValue, withoutSuffix?: boolean): string => {
	const { value, ts } = _value;
	if (render) {
		const { decimals = 4, suffix = '' } = render;
		return withoutSuffix ? `${Number(value).toFixed(decimals)}` : `${Number(value).toFixed(decimals)}${suffix}`;
	} else {
		return Number(value).toString();
	}
};

/**
 * In case of type and config mismatching we need to take care of error handling
 *
 * @param render
 * @param _value
 */
const renderEnum = (render: EnumRender, _value: PointValue): string => {
	const { value, ts } = _value;
	if (render) {
		try {
			return render.states[value] || String(value);
		} catch (err: any) {
			return String(value);
		}
	} else {
		return String(value);
	}
};

export const renderPointValue = (point: Point, value: PointValue | null, errorString: string = '--', withoutSuffix?: boolean): string => {
	if (point && value) {
		const { type, customRender } = point;

		switch (type) {
			case 'enum':
				return renderEnum(<EnumRender>customRender, value);
			case 'numeric':
				if ((customRender as NumericRender).suffix?.toLocaleLowerCase().includes('°c') && value.value < -100) {
					return errorString;
				}
				return renderNumeric(<NumericRender>customRender, value, withoutSuffix);
		}
	}
	return errorString;
};

export const renderPointRawValue = (point: Point, value: number) => {
	return renderPointValue(point, { value, ts: -1 });
};

export const renderPointTime = (value: PointValue | number | null) => {
	const ts: number = value instanceof Number ? (value as number) : value && value.hasOwnProperty('ts') ? (value as PointValue).ts : -1;

	return ts && ts > -1 ? dateString(ts) : 'Error: Unknown time';
};

export const renderPointValueTime = (point: Point | null, value: PointValue | null) => {
	const rawValue = value ? value.value : null;
	const rawValueStr = rawValue !== null ? limitDec(rawValue, 3) : '-';
	return point && value ? `${renderPointValue(point, value)}@${renderPointTime(value)} [${rawValueStr}]` : 'Error: Unknown value';
};
