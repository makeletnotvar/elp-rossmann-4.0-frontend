import { limitDec } from 'helpers/numbers';
import { describe, expect, it } from 'vitest';

describe('limitDec', () => {
	it('should pass', () => {
		expect(limitDec(1.234567, 3)).toEqual(1.234);
	});

	it('should pass', () => {
		expect(limitDec(1.234567, 1)).toEqual(1.2);
	});

	it('should pass', () => {
		expect(limitDec(1.234567, 2)).toEqual(1.23);
	});

	it('should pass', () => {
		expect(limitDec(1.23, 4)).toEqual(1.23);
	});

	it('should pass', () => {
		expect(limitDec(1, 4)).toEqual(1);
	});
});
