import { isArray } from 'lodash';
import { useBuildingUnitsState } from 'modules/building/redux/buildingUnits';
import { useMemo } from 'react';

export const useGetAHUUnitConfig = (): string | undefined => {
	const { units = [], fetched } = useBuildingUnitsState();

	const ahuConfig = useMemo(() => {
		if (isArray(units) && (units || []).length > 0 && fetched) {
			const ahuUnit = units.find(unit => (unit?.xid || '').toLocaleLowerCase().includes('ahu'));
			if (isArray(ahuUnit?.params) && (ahuUnit?.params || []).length > 0) {
				const ahuParams = ahuUnit?.params || [];
				const ahuConfig = ahuParams.find(param => (param?.param || '').toLocaleLowerCase().includes('konfig'))?.value;
				return ahuConfig;
			}
		}
	}, [units, fetched]);

	return ahuConfig;
};
