import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { usePointByXid, usePointValueByXid } from 'modules/common/redux/poll';
import { useEffect, useState } from 'react';
/*
  Heatpump

  punkty:
  _onoff - 0-1 (czasem onoffr)
  _spr - 0-1 - sprężarka 
  _mode - 0...N - tryb pracy (czasem _value)
  _vent - 0-1 - wentylator

  alarm i stan komunikacji wyciągany z alarmów

  Logika:
  - urządzenie nie pracuje gdy vent<1
  - urządzenie pracuje w trybie wentylacja gdy _spr<1
  - urządzenie pracuje w trybie chłodzenia gdy _mode zawiera słowo "chł"
  - w innym wypadku grzanie

  Użytkowo: 
  - Urządzenie na wizualizacji grzeje gdy jest w trybie grzania, urządzenie działa i stan ma w nazwie "grz"
*/

export const useHPStatus = (xidPreffixFilter?: string) => {
	const stateValue = usePointValueByXid(xidPreffixFilter + '_onoff', true);
	const stateValueR = usePointValueByXid(xidPreffixFilter + '_onoffr', true); // alternative state for some heatpumps
	const mode = usePointByXid(xidPreffixFilter + '_mode');
	const modeValve = usePointByXid(xidPreffixFilter + '_valve'); // alternative mode for some heatpumps
	const tempRenderedValue = usePointRenderedValue(null, xidPreffixFilter + '_tmain', '--', true);
	const renderedValue = usePointRenderedValue(mode && mode.uuid ? mode.uuid : modeValve && modeValve.uuid ? modeValve.uuid : null);
	const [status, setStatus] = useState<[boolean, 'cooling' | 'heating' | 'other']>([false, 'other']);

	useEffect(() => {
		const isStopped = (stateValue && stateValue?.value < 1) || (stateValueR && stateValueR?.value < 1) || renderedValue.toLowerCase().includes('stop');

		if (isStopped) {
			setStatus([false, 'other']);
		} else if (renderedValue && renderedValue.toLowerCase().includes('chł')) {
			setStatus([true, 'cooling']);
		} else if (renderedValue && renderedValue.toLowerCase().includes('grz')) {
			setStatus([true, 'heating']);
		} else {
			setStatus([false, 'other']);
		}
	}, [renderedValue, stateValue, stateValueR]);

	return {
		isWorking: status[0],
		mode: status[1],
		tempRenderedValue,
	};
};
