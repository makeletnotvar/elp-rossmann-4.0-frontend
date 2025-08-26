import { describe, expect, it } from 'vitest';
import { stringComparator } from './data';

describe('@stringComparator', () => {
	it('Should pass for valid strings', () => {
		const string = 'some string';
		const query = 'som';
		expect(stringComparator(string, query)).toEqual(true);
	});

	it('Should pass for two words valid strings', () => {
		const string = 'some string';
		const query = 'som ing';
		expect(stringComparator(string, query)).toEqual(true);
	});

	it('Should fail for invalid strings', () => {
		const string = 'some string';
		const query = 'somx';
		expect(stringComparator(string, query)).toEqual(false);
	});

	it('Should fail for two words invalid strings', () => {
		const string = 'some string';
		const query = 'somx str';
		expect(stringComparator(string, query)).toEqual(false);
	});
});
