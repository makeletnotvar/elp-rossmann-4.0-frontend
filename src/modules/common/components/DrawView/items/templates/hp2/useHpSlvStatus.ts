import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { usePointByXid, usePointValueByXid } from 'modules/common/redux/poll';
import { useEffect, useState } from 'react';

export const useHPSlvStatus = (xidPreffixFilter?: string, xidPreffixFilterMaster?: string) => {
	const stateValue = usePointValueByXid(xidPreffixFilterMaster + '_onoff', true);
	const stateValueR = usePointValueByXid(xidPreffixFilterMaster + '_onoffr', true);
	const mode = usePointByXid(xidPreffixFilterMaster + '_mode');
	const modeValve = usePointByXid(xidPreffixFilterMaster + '_valve');
	const renderedValue = usePointRenderedValue(mode && mode.uuid ? mode.uuid : modeValve && modeValve.uuid ? modeValve.uuid : null);

	const modeCoolSlv = usePointValueByXid(xidPreffixFilter + '_cool', true);
	const modeHeatSlv = usePointValueByXid(xidPreffixFilter + '_heat', true);

	const tempRenderedValue = usePointRenderedValue(null, xidPreffixFilter + '_tmain', '--', true);

	const [status, setStatus] = useState<[boolean, 'cooling' | 'heating' | 'other']>([false, 'other']);

	useEffect(() => {
		const isStopped = (stateValue && stateValue?.value < 1) || (stateValueR && stateValueR?.value < 1) || renderedValue.toLowerCase().includes('stop');

		if (isStopped) {
			setStatus([false, 'other']);
		} else if (modeCoolSlv && modeCoolSlv?.value && modeCoolSlv.value > 0) {
			setStatus([true, 'cooling']);
		} else if (modeHeatSlv && modeHeatSlv?.value && modeHeatSlv.value > 0) {
			setStatus([true, 'heating']);
		} else {
			setStatus([false, 'other']);
		}
	}, [modeCoolSlv, modeHeatSlv, renderedValue, stateValue, stateValueR]);

	return {
		isWorking: status[0],
		mode: status[1],
		tempRenderedValue,
	};
};
