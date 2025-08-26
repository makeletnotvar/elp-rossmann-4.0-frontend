import { StateResult } from './getState';

type ModeStates = Record<number, string>;
type ModeResult = 'vent' | 'heating' | 'cooling' | 'empty';

interface GetModeProps {
	isComAlarm: boolean;
	mode: PointValue | null;
	modeY1?: PointValue | null;
	modeY2?: PointValue | null;
	modeStates: ModeStates;
	modeY1States?: ModeStates;
	modeY2States?: ModeStates;
	stateWorkmode: StateResult;
}

export const getMode = ({ isComAlarm, mode, modeStates, stateWorkmode, modeY1States, modeY2States, modeY1, modeY2 }: GetModeProps): ModeResult => {
	if (stateWorkmode !== 'working' || isComAlarm) {
		return 'empty';
	}

	if (modeY1 && modeY1States) {
		const valueY1 = modeY1States?.[modeY1?.value ?? -1]?.toLowerCase() ?? '';
		if (valueY1.includes('otw')) {
			return 'heating';
		}
	}

	if (modeY2 && modeY2States) {
		const valueY2 = modeY2States?.[modeY2?.value ?? -1]?.toLowerCase() ?? '';
		if (valueY2.includes('otw')) {
			return 'cooling';
		}
	}

	if (!modeY1States && !modeY2States && mode && modeStates) {
		const value = modeStates[mode?.value ?? -1]?.toLowerCase() ?? '';

		if (value.includes('wen')) {
			return 'vent';
		}
		if (value.includes('grz')) {
			return 'heating';
		}
		if (value.includes('chł')) {
			return 'cooling';
		}
	}

	return 'vent';
};
