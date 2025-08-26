import { getStringsCommonStartPart, trimDash } from 'helpers/strings';
import { describe, expect, it } from 'vitest';

const strings: string[] = [
	'Klimakonwektor - Strefa 2 - Temperatura',
	'Klimakonwektor - Strefa 2 - Bieg',
	'Klimakonwektor - Strefa 2 - Tryb',
	'Klimakonwektor - Strefa 2 - Alarm',
];

describe('getStringsCommonStartPart', () => {
	it('should pass', () => {
		const result: string = getStringsCommonStartPart(strings);
		expect(result).toEqual('Klimakonwektor - Strefa 2 - ');
	});

	it('should fail', () => {
		const result: string = getStringsCommonStartPart(strings);
		expect(result).not.toEqual('Klimakonwektor - Strefa 2 ');
	});

	it('should fail', () => {
		const result: string = getStringsCommonStartPart(strings);
		expect(result).not.toEqual('Klimakonwektor - Strefa 2 -  ');
	});
});

describe('trimDash', () => {
	it('should pass', () => {
		expect(trimDash('aaa - ')).toEqual('aaa');
	});

	it('should fail', () => {
		expect(trimDash('aaa - ')).not.toEqual('aaa - ');
	});

	it('should fail', () => {
		expect(trimDash('aaa - ')).not.toEqual('aaa ');
	});
});
