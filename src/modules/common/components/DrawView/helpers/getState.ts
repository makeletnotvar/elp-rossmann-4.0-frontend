export type StateResult = 'working' | 'stopped' | 'unknown';

export const getState = (state: PointValue | null, workmodeStates: Record<number, string>): StateResult => {
	if (!workmodeStates) return 'unknown';

	const label = workmodeStates[state?.value ?? -1]?.toLowerCase();

	if (label) {
		const stateSubstring = label.substring(0, 3);

		if (stateSubstring.includes('pra')) {
			return 'working';
		}

		if (stateSubstring.includes('sto')) {
			return 'stopped';
		}
	}

	return 'unknown';
};
