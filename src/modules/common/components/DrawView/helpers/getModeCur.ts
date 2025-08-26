type ModeStates = Record<number, string>;
type ModeResult = 'vent' | 'heating' | 'cooling' | 'empty';

export const getModeCur = (isComAlarm: boolean, mode: PointValue | null, modeStates: ModeStates, isWorking: boolean): ModeResult => {
	if (!isWorking || isComAlarm || !modeStates) {
		return 'empty';
	}

	const label = modeStates[mode?.value ?? -1];

	if (label) {
		const modeSubstring = label.toLowerCase();

		if (modeSubstring.includes('wen')) {
			return 'vent';
		}

		if (modeSubstring.includes('grz')) {
			return 'heating';
		}
	}

	return 'empty';
};
