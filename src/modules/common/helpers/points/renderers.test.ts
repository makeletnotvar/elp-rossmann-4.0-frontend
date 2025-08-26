import { renderPointTime, renderPointValueTime } from 'modules/common/helpers/points/renderers';
import { describe, expect, it } from 'vitest';

describe('renderPointValueTime', () => {
	const analogPoint = {
		uuid: 'aaaa',
		active: true,
		xid: 'tset',
		value: () => Math.random() * 100,
		type: 'numeric',
		registerName: 'aaaa',
		registerNumber: 0,
		customRender: {
			decimals: 2,
			suffix: '°C',
			min: 0,
			max: 100,
		},
		archive: true,
		archiveConfig: {
			time: 544,
			change: 0,
		},
	};

	it('should pass', () => {
		const value = {
			value: 0,
			ts: Date.now(),
		};

		// @ts-ignore
		const res = renderPointValueTime(analogPoint, value);

		expect(res).toEqual(`0.00°C@${renderPointTime(value)} [0]`);
	});

	it('should pass', () => {
		const value = {
			value: 1,
			ts: Date.now(),
		};

		// @ts-ignore
		const res = renderPointValueTime(analogPoint, value);

		expect(res).toEqual(`1.00°C@${renderPointTime(value)} [1]`);
	});

	it('should fail if invalid time/value', () => {
		const value = {
			value: 0,
			ts: -1,
		};

		// @ts-ignore
		const res = renderPointValueTime(null, value);

		expect(res).toEqual('Error: Unknown value');
	});
});
