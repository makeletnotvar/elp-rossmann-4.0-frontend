import { useCurrentBuildingPoint } from 'modules/common/helpers/points/useCurrentBuildingPoint';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { useViews } from 'modules/common/redux/views';
import { useEffect, useState } from 'react';

export const useAhuData = (buildingUUID?: string) => {
	const [mode, setMode] = useState<'cooling' | 'heating' | 'mixed' | 'other'>('other');
	const [ahuUUID, setAhuUUID] = useState<string | null>(null);

	const { views } = useViews();

	const COOLER_POINTS_XIDS = ['dxpwr', 'freonpwr'];
	const HEATER_POINTS_XIDS = ['hepwr', 'gaspwr', 'y1', 'hwpwr'];
	const FX_POINTS_XIDS = ['ahu_fx1mode', 'ahu_fx2mode', 'ahu_fx3mode'];

	const coolerPoint = useCurrentBuildingPoint(COOLER_POINTS_XIDS);
	const heaterPoint = useCurrentBuildingPoint(HEATER_POINTS_XIDS);
	const fxPoint = useCurrentBuildingPoint(FX_POINTS_XIDS);

	const coolerValue = usePointRenderedValue(coolerPoint?.uuid ?? null);
	const heaterValue = usePointRenderedValue(heaterPoint?.uuid ?? null);
	const fxValue = usePointRenderedValue(fxPoint?.uuid ?? null);

	const b1Value = usePointRenderedValue(null, 'b1', '--', true);
	const b2Value = usePointRenderedValue(null, 'b2', '--', true);
	const pwrsupValue = usePointRenderedValue(null, 'pwrsup', '--', true);
	const unitStateValue = usePointRenderedValue(null, 'unitstate', '--', true);

	useEffect(() => {
		const parsedCooler = parseFloat(coolerValue);
		const parsedHeater = parseFloat(heaterValue);

		const hasCooler = coolerPoint && !isNaN(parsedCooler);
		const hasHeater = heaterPoint && !isNaN(parsedHeater);

		if (fxPoint && fxValue && (fxValue?.toLocaleLowerCase().includes('chł') || fxValue?.toLocaleLowerCase().includes('grz'))) {
			if (
				(hasHeater && parsedHeater > 0 && fxValue?.toLocaleLowerCase().includes('chł')) ||
				(hasCooler && parsedCooler > 0 && fxValue?.toLocaleLowerCase().includes('grz'))
			) {
				setMode('mixed');
			} else if (fxValue?.toLocaleLowerCase().includes('grz')) {
				setMode('heating');
			} else if (fxValue?.toLocaleLowerCase().includes('chł')) {
				setMode('cooling');
			} else {
				setMode('other');
			}
		} else {
			if (hasCooler && parsedCooler > 0 && hasHeater && parsedHeater > 0) {
				setMode('mixed');
			} else if (hasCooler && parsedCooler > 0) {
				setMode('cooling');
			} else if (hasHeater && parsedHeater > 0) {
				setMode('heating');
			} else if (hasCooler && parsedHeater === 0 && hasHeater && parsedHeater === 0) {
				setMode('other');
			} else {
				setMode('other');
			}
		}
	}, [coolerPoint, heaterPoint, coolerValue, heaterValue, fxPoint, fxValue]);

	useEffect(() => {
		if (views && views.length > 0) {
			const findedAHUView = views.find(view => (view.name || '').toLocaleLowerCase().includes('centrala wentylacyjna'));
			if (findedAHUView) {
				setAhuUUID(findedAHUView.uuid);
			} else {
				setAhuUUID(null);
			}
		}
	}, [buildingUUID, views]);

	return {
		ahuUUID,
		mode,
		b1Value,
		b2Value,
		pwrsupValue,
		unitStateValue,
	};
};
