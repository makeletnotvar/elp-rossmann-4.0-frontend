import { useMemo } from 'react';
import { useGetAHUUnitConfig } from './getAHUUnitConfig';

export enum AHURecType {
	CROSS = 'CROSS',
	ROTARY = 'ROTARY',
}

export const useGetAHURecType = (): AHURecType => {
	const ahuConfig = useGetAHUUnitConfig();

	const ahuRecType = useMemo(() => {
		const hasRotaryConfig = (ahuConfig || '').toLocaleLowerCase()?.includes('-om-') || (ahuConfig || '').toLocaleLowerCase()?.includes('-o-');
		if (hasRotaryConfig) {
			return AHURecType.ROTARY;
		}
		return AHURecType.CROSS;
	}, [ahuConfig]);

	return ahuRecType;
};
